// scraper/scraper-service.js (simple orchestrator)
const IndeedScraper = require('./scrapers/indeed-scraper');
(async () => {
  const location = process.env.LOCATION || 'United States';
  const keywords = process.env.KEYWORDS || 'software engineer';
  console.log('Starting scraper run', { location, keywords });
  const s = new IndeedScraper();
  await s.scrapeJobs(location, keywords, 1);
  console.log('Scraper finished');
  process.exit(0);
})().catch(e=>{console.error(e); process.exit(1);});
