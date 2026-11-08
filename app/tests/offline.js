// Checks the app opens with no internet after the first visit (service worker cache).
const { chromium } = require('playwright');
const URL = process.env.APP_URL || 'http://localhost:8765/';
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(URL);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();                       // let the worker control the page
  await page.click('text=Kiswahili');
  await ctx.setOffline(true);
  await page.reload();
  await page.waitForSelector('#bizName', { timeout: 5000 });   // settings screen reloaded from cache
  await page.goto(URL + '#/sale');
  await page.fill('#amount', '250');
  await page.click('button[type=submit]');
  await page.waitForSelector('.success');
  await browser.close();
  console.log('OFFLINE TEST PASSED');
})().catch(e => { console.error('OFFLINE TEST FAILED:', e.message); process.exit(1); });
