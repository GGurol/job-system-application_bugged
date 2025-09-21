const { chromium } = require('playwright');
const { Pool } = require('pg');
class AutoApplyBot {
  constructor(){ this.pool = new Pool({ connectionString: process.env.DATABASE_URL }); }
  async processApplication(userId, jobId){ console.log('Stub: processApplication', userId, jobId); }
}
module.exports = AutoApplyBot;
