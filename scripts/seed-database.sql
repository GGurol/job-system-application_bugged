-- Simple seed for job_postings if not already present
INSERT INTO job_postings (title, company, location, description, application_url, source, source_id, is_active)
SELECT 'Software Engineer', 'Acme Corp', 'Remote', 'Build cool things', 'https://example.com/apply', 'seed', 'seed-1', true
WHERE NOT EXISTS (
  SELECT 1 FROM job_postings WHERE source = 'seed' AND source_id = 'seed-1'
);

INSERT INTO job_postings (title, company, location, description, application_url, source, source_id, is_active)
SELECT 'Frontend Developer', 'Globex', 'New York, NY', 'React/Next.js role', 'https://example.com/apply2', 'seed', 'seed-2', true
WHERE NOT EXISTS (
  SELECT 1 FROM job_postings WHERE source = 'seed' AND source_id = 'seed-2'
);
