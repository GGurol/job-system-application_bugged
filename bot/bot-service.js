// bot/bot-service.js (example runner)
const AutoApplyBot = require('./auto-apply-bot');
(async ()=>{
  console.log('Starting auto-apply bot sample run');
  const b = new AutoApplyBot();
  // Example: no queue connected in this minimal setup
  console.log('Bot ready (no queued jobs in this example)');
  process.exit(0);
})().catch(e=>{console.error(e); process.exit(1);});
