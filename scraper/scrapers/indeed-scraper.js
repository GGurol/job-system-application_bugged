const { chromium } = require('playwright');
const { Pool } = require('pg');

class IndeedScraper {
  constructor() {
    // ADDED: Log the DATABASE_URL to see what the script is receiving.
    console.log("Scraper received DATABASE_URL:", process.env.DATABASE_URL);

    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set for the scraper.");
    }
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async scrapeJobs(location = 'United States', keywords = 'software engineer', pages = 1) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ userAgent: 'Mozilla/5.0' });
    const page = await context.newPage();
    try {
      const url = `https://www.indeed.com/jobs?q=${encodeURIComponent(keywords)}&l=${encodeURIComponent(location)}`;
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      const jobs = await page.$$eval('a[href*="/pagead/clk"], a[href*="/rc/clk"]', els =>
        els.slice(0, 20).map(a => ({
          title: a.textContent.trim(),
          url: a.href
        }))
      );
      for (const job of jobs) {
        await this.saveJob({
          title: job.title || 'Job',
          company: 'Unknown',
          location,
          description: '',
          application_url: job.url,
          source: 'indeed',
          source_id: job.url
        });
      }
      console.log(`Scraped and saved ${jobs.length} jobs.`);
    } catch (e) {
      console.error('Scraping error:', e);
    } finally {
      await browser.close();
    }
  }

  async saveJob(job) {
    try {
      await this.pool.query(
        `INSERT INTO job_postings (title, company, location, description, application_url, source, source_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (source, source_id) DO NOTHING`,
        [job.title, job.company, job.location, job.description, job.application_url, job.source, job.source_id]
      );
    } catch (e) {
      console.error('Error saving job to DB:', e);
    }
  }
}

module.exports = IndeedScraper;