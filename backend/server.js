// backend/server.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const { Pool } = require('pg');
const Queue = require('bull');
const { spawn } = require('child_process');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Database configuration with sensible defaults for Docker
const DB_NAME = process.env.DB_NAME || 'job_app_db';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'Admin';
const DB_HOST = process.env.DB_HOST || 'db'; // Use the docker-compose service name
const DB_PORT = Number(process.env.DB_PORT || 5432);

let pool;

async function initializeDatabaseIfNeeded() {
  try {
    const adminConnStr = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/postgres`;
    const adminPool = new Pool({ connectionString: adminConnStr });
    const result = await adminPool.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [DB_NAME]);
    if (result.rowCount === 0) {
      await adminPool.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`Created database ${DB_NAME}`);
    }
    await adminPool.end();

    const appConnStr = process.env.DATABASE_URL || `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    pool = new Pool({ connectionString: appConnStr });

    const initPath = path.join(__dirname, '..', 'database', 'init.sql');
    if (fs.existsSync(initPath)) {
      const sql = fs.readFileSync(initPath, 'utf8');
      await pool.query(sql);
      const seedPath = path.join(__dirname, '..', 'scripts', 'seed-database.sql');
      if (fs.existsSync(seedPath)) {
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await pool.query(seedSql);
      }
    }
  } catch (e) {
    console.error('Database initialization error:', e.message);
    throw e;
  }
}

let applyQueue;
try {
  applyQueue = new Queue('auto-apply', process.env.REDIS_URL || 'redis://redis:6379');
} catch(e) {
  console.log('Redis not available, auto-apply queue disabled');
  applyQueue = null;
}

// --- CORRECTED CORS CONFIGURATION ---
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));
// --- END OF CORRECTION ---

app.use(express.json());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, linkedinUrl } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, linkedin_url) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, first_name, last_name`,
      [email, hashedPassword, firstName, lastName, phone, linkedinUrl]
    );
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret');
    res.status(201).json({ token, user });
  } catch (error) {
    if (error && error.code === '23505') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
});

app.get('/profile/me', authenticateToken, async (req, res) => {
  try {
    const userRes = await pool.query('SELECT id, email, first_name, last_name, phone, linkedin_url FROM users WHERE id = $1', [req.user.userId]);
    const prefRes = await pool.query('SELECT preferred_countries, preferred_contract_types, keywords, salary_min, salary_max FROM user_preferences WHERE user_id = $1', [req.user.userId]);
    res.json({ user: userRes.rows[0], preferences: prefRes.rows[0] || null });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/profile/me', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, linkedinUrl } = req.body || {};
    await pool.query('UPDATE users SET first_name = COALESCE($2, first_name), last_name = COALESCE($3, last_name), phone = COALESCE($4, phone), linkedin_url = COALESCE($5, linkedin_url) WHERE id = $1', [req.user.userId, firstName, lastName, phone, linkedinUrl]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/profile/preferences', authenticateToken, async (req, res) => {
  try {
    const { preferredCountries = [], preferredContractTypes = [], keywords = [], salaryMin = null, salaryMax = null } = req.body || {};
    await pool.query(`
      INSERT INTO user_preferences (user_id, preferred_countries, preferred_contract_types, keywords, salary_min, salary_max)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id) DO UPDATE SET
        preferred_countries = EXCLUDED.preferred_countries,
        preferred_contract_types = EXCLUDED.preferred_contract_types,
        keywords = EXCLUDED.keywords,
        salary_min = EXCLUDED.salary_min,
        salary_max = EXCLUDED.salary_max,
        updated_at = CURRENT_TIMESTAMP
    `, [req.user.userId, preferredCountries, preferredContractTypes, keywords, salaryMin, salaryMax]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/jobs/matches', authenticateToken, async (req, res) => {
  try {
    const pref = await pool.query('SELECT keywords FROM user_preferences WHERE user_id = $1', [req.user.userId]);
    const keywords = (pref.rows[0]?.keywords || []).filter(Boolean);
    if (keywords.length === 0) {
      const r = await pool.query('SELECT id, title, company, location, created_at FROM job_postings WHERE is_active = true ORDER BY created_at DESC LIMIT 20');
      return res.json(r.rows);
    }
    const query = keywords.map((_, i) => `(title ILIKE $${i + 1} OR description ILIKE $${i + 1})`).join(' OR ');
    const params = keywords.map(k => `%${k}%`);
    const sql = `SELECT id, title, company, location, created_at FROM job_postings WHERE is_active = true AND (${query}) ORDER BY created_at DESC LIMIT 50`;
    const r = await pool.query(sql, params);
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/admin/scrape', authenticateToken, async (req, res) => {
  try {
    const keywords = req.body?.keywords || process.env.SCRAPE_KEYWORDS || 'software engineer';
    const location = req.body?.location || process.env.SCRAPE_LOCATION || 'United States';
    const child = spawn(process.platform === 'win32' ? 'node.exe' : 'node', ['scraper/scraper-service.js'], {
      cwd: path.join(__dirname, '..'),
      env: { ...process.env, KEYWORDS: keywords, LOCATION: location, DATABASE_URL: process.env.DATABASE_URL || `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}` },
      stdio: 'inherit'
    });
    child.on('close', (code) => console.log('admin scraper exited', code));
    res.json({ started: true, keywords, location });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/admin/stats', authenticateToken, async (req, res) => {
  try {
    const r = await pool.query('SELECT COUNT(*)::int AS jobs, COALESCE(MAX(created_at), NOW()) AS last_added FROM job_postings');
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ADDED: Endpoint to manually create a job posting
app.post('/admin/jobs', authenticateToken, async (req, res) => {
  try {
    const { title, company, location, description, application_url } = req.body;
    
    // Basic validation
    if (!title || !company) {
      return res.status(400).json({ error: 'Title, Company, and Application URL are required.' });
    }

    const result = await pool.query(
      `INSERT INTO job_postings (title, company, location, description, application_url, source, is_active) 
       VALUES ($1, $2, $3, $4, $5, 'manual', true) RETURNING id`,
      [title, company, location, description, application_url]
    );
    
    res.status(201).json({ id: result.rows[0].id, message: 'Job created successfully' });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job posting' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT id, email, password_hash, first_name, last_name FROM users WHERE email = $1',[email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret');
    delete user.password_hash;
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/cv/upload', authenticateToken, upload.single('cv'), async (req, res) => {
  try {
    const { makeActive } = req.body;
    const file = req.file;
    if (makeActive === 'true') {
      await pool.query('UPDATE cvs SET is_active = false WHERE user_id = $1', [req.user.userId]);
    }
    const result = await pool.query(
      `INSERT INTO cvs (user_id, filename, file_path, file_size, mime_type, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [req.user.userId, file.originalname, file.path, file.size, file.mimetype, makeActive === 'true']
    );
    res.status(201).json({ id: result.rows[0].id, message: 'CV uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/jobs/list', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const result = await pool.query('SELECT * FROM job_postings WHERE is_active = true ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/jobs/public-list', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 5, 20);
    const result = await pool.query('SELECT id, title, company, location, created_at FROM job_postings WHERE is_active = true ORDER BY created_at DESC LIMIT $1', [limit]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.post('/dev/seed', async (req, res) => {
    try {
      const count = await pool.query('SELECT COUNT(*)::int AS c FROM job_postings');
      if (count.rows[0].c > 0) return res.json({ seeded: false, message: 'Jobs already exist' });
      await pool.query(`
        INSERT INTO job_postings (title, company, location, description, application_url, source, source_id, is_active)
        VALUES 
        ('Software Engineer', 'Acme Corp', 'Remote', 'Build cool things', 'https://example.com/apply', 'seed', 'seed-dev-1', true),
        ('Frontend Developer', 'Globex', 'New York, NY', 'React/Next.js role', 'https://example.com/apply2', 'seed', 'seed-dev-2', true);
      `);
      res.json({ seeded: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/dev/scrape', async (req, res) => {
    try {
      const keywords = req.body?.keywords || 'software engineer';
      const location = req.body?.location || 'United States';
      const child = spawn(process.platform === 'win32' ? 'node.exe' : 'node', ['scraper/scraper-service.js'], {
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, KEYWORDS: keywords, LOCATION: location, DATABASE_URL: process.env.DATABASE_URL || `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}` },
        stdio: 'inherit'
      });
      child.on('close', (code) => console.log('scraper exited', code));
      res.json({ started: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
}

const schedule = process.env.CRON_SCHEDULE || '0 */6 * * *';
try {
  cron.schedule(schedule, () => {
    try {
      const keywords = process.env.SCRAPE_KEYWORDS || 'software engineer';
      const location = process.env.SCRAPE_LOCATION || 'United States';
      const child = spawn(process.platform === 'win32' ? 'node.exe' : 'node', ['scraper/scraper-service.js'], {
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, KEYWORDS: keywords, LOCATION: location, DATABASE_URL: process.env.DATABASE_URL || `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}` },
        stdio: 'ignore',
        detached: true
      });
      child.unref();
      console.log('Scheduled scraper launched');
    } catch(e) { console.error('schedule error', e.message); }
  });
  console.log('Scraper scheduler active:', schedule);
} catch(e) { console.error('Failed to start scheduler', e.message); }

app.post('/jobs/swipe', authenticateToken, async (req, res) => {
  try {
    const { jobId, action } = req.body;
    await pool.query(
      `INSERT INTO user_jobs (user_id, job_id, action) 
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, job_id) 
       DO UPDATE SET action = $3, created_at = CURRENT_TIMESTAMP`,
      [req.user.userId, jobId, action]
    );
    if (action === 'swiped_right' && applyQueue) {
      await applyQueue.add('auto-apply', { userId: req.user.userId, jobId });
    }
    res.json({ message: 'Swipe recorded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/applications/status', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`SELECT uj.*, j.title, j.company, j.location FROM user_jobs uj JOIN job_postings j ON uj.job_id = j.id WHERE uj.user_id = $1 AND uj.action IN ('swiped_right', 'applied') ORDER BY uj.created_at DESC`, [req.user.userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

initializeDatabaseIfNeeded()
  .then(() => {
    app.listen(PORT, () => { 
      console.log(`Server running on port ${PORT}`);
    });
    console.log('Database initialized successfully');
  })
  .catch((e) => {
    console.log('Server startup failed:', e.message);
    process.exit(1);
  });