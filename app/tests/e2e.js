// End-to-end test of Biashara Records. Run from the app folder:
//   python3 -m http.server 8765 &   then   node tests/e2e.js [screenshotDir]
const { chromium, devices } = require('playwright');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const URL = process.env.APP_URL || 'http://localhost:8765/';
const shots = process.argv[2];
let n = 0;
async function shot(page, name) {
  if (!shots) return;
  fs.mkdirSync(shots, { recursive: true });
  await page.screenshot({ path: path.join(shots, String(++n).padStart(2, '0') + '-' + name + '.png'), fullPage: true });
}
const text = (page, sel) => page.locator(sel).innerText();

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['Galaxy S9+'], deviceScaleFactor: 1, acceptDownloads: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('dialog', async d => {
    if (d.type() === 'alert') { errors.push('UNEXPECTED ALERT: ' + d.message()); return d.dismiss(); }
    if (d.type() === 'prompt') return d.accept(page.__promptAnswer || '');
    return d.accept();
  });

  // 1. First run: language choice
  await page.goto(URL);
  await shot(page, 'language');
  await page.click('text=Kiswahili');
  await page.waitForSelector('#bizName');
  await page.fill('#bizName', 'Duka la Mama Wanjiru');
  await page.fill('#till', '123456');
  await page.fill('#kraPin', 'a123456789z');
  await page.click('button[type=submit]');
  await page.waitForSelector('.big.sale');
  assert.match(await text(page, '#brand'), /Mama Wanjiru/);
  await shot(page, 'home-empty');

  // 2. M-Pesa sale via pasted SMS
  await page.click('.big.sms');
  await page.waitForSelector('#sms');
  await page.fill('#sms', 'SKL4ABC123 Confirmed. You have received Ksh1,500.00 from JOHN KAMAU 0712345678 on 8/11/26 at 10:15 AM. New M-PESA balance is Ksh5,000.00.');
  await page.click('text=SOMA SMS');
  await page.waitForSelector('[data-act=smsUse]');
  await shot(page, 'sms-read');
  await page.click('[data-act=smsUse][data-v=sale]');
  await page.waitForSelector('form[data-form=sale]');
  assert.strictEqual(await page.inputValue('#amount'), '1500');
  assert.strictEqual(await page.inputValue('#code'), 'SKL4ABC123');
  assert.strictEqual(await page.inputValue('#custAny'), 'JOHN KAMAU');
  assert.strictEqual(await page.inputValue('#phone'), '0712345678');
  await page.fill('#item', 'Unga 2kg x5');
  await shot(page, 'sale-form');
  await page.click('button[type=submit]');
  await page.waitForSelector('.success');
  const wa = await page.getAttribute('a.btn.wa', 'href');
  assert.ok(wa.startsWith('https://wa.me/254712345678?text='), 'receipt WhatsApp link uses customer phone: ' + wa);
  assert.match(decodeURIComponent(wa), /Receipt|Risiti/);
  await shot(page, 'sale-done');

  // 3. Cash sale (typed by hand)
  await page.click('text=Ongeza nyingine');
  await page.waitForSelector('form[data-form=sale]');
  await page.fill('#amount', '360');
  await page.click('label.choice:has(input[value=cash])');
  assert.ok(await page.locator('#mpesaBox').isHidden());
  await page.click('button[type=submit]');
  await page.waitForSelector('.success');

  // 4. Credit sale -> becomes a debt; overdue due date
  await page.goto(URL + '#/sale');
  await page.fill('#amount', '4,600');
  await page.click('label.choice:has(input[value=credit])');
  await page.click('button[type=submit]');               // no name -> must refuse
  assert.match(await text(page, '#toast'), /jina/i);
  await page.fill('#cust', '<img src=x onerror=alert(1)>Hotel Baraka');
  await page.fill('#due', '2020-01-01');
  await page.click('button[type=submit]');
  await page.waitForSelector('.success');

  // 5. Expense without eTIMS -> warning + WhatsApp request
  await page.goto(URL + '#/expense');
  await page.fill('#amount', '8000');
  await page.click('label.choice:has(input[value=rent])');
  await page.click('label.choice:has(input[value=no])');
  assert.ok(await page.locator('#etimsWarn').isVisible());
  await shot(page, 'expense-form');
  await page.click('button[type=submit]');
  await page.waitForSelector('.success');
  assert.ok(await page.locator('text=Mwombe invoice').isVisible());
  await shot(page, 'expense-done');

  // 6. Expense WITH eTIMS, and owner drawings (must not count as cost)
  await page.goto(URL + '#/expense');
  await page.fill('#amount', '12500');
  await page.click('label.choice:has(input[value=yes])');
  await page.click('button[type=submit]');
  await page.waitForSelector('.success');
  await page.goto(URL + '#/expense');
  await page.fill('#amount', '1000');
  await page.click('label.choice:has(input[value=drawings])');
  assert.ok(await page.locator('#etimsBox').isHidden());
  await page.click('button[type=submit]');
  await page.waitForSelector('.success');

  // 7. Home totals: sales 1500+360+4600 = 6460; spent 8000+12500 = 20500 (drawings excluded)
  await page.goto(URL + '#/');
  const home = await text(page, '.stats');
  assert.match(home, /KSh 6,460/); assert.match(home, /KSh 20,500/); assert.match(home, /-KSh 14,040/);
  assert.strictEqual((await text(page, '.big.debt .count')).trim(), '1');
  await shot(page, 'home-data');

  // 8. Debts: XSS rendered as text, overdue, partial payment, reminder
  await page.click('.big.debt');
  await page.waitForSelector('a.row');
  assert.match(await text(page, 'main'), /<img src=x onerror=alert\(1\)>Hotel Baraka/);
  assert.match(await text(page, 'main'), /Muda umepita/);
  await shot(page, 'debts');
  await page.click('a.row');
  await page.waitForSelector('form[data-form=pay]');
  await page.fill('#amount', '9999');
  await page.click('button[type=submit]');
  assert.match(await text(page, '#toast'), /zaidi/);
  await page.fill('#amount', '2000');
  await page.click('label.choice:has(input[value=cash])');
  await page.click('button[type=submit]');
  await page.waitForTimeout(100);
  assert.match(await text(page, 'main'), /KSh 2,600/);
  const rem = decodeURIComponent(await page.getAttribute('a.btn.wa', 'href'));
  assert.match(rem, /KSh 2,600/); assert.match(rem, /123456/);
  await shot(page, 'debt-detail');

  // 9. Report numbers
  await page.goto(URL + '#/report');
  const rep = await text(page, 'main');
  assert.match(rep, /KSh 6,460/); assert.match(rep, /KSh 20,500/);
  assert.match(rep, /61%/);                         // 12500 / 20500
  assert.match(rep, /KSh 8,000/);                   // at risk
  assert.match(rep, /KSh 96\.9/);                   // 1.5% of 6460
  await shot(page, 'report');
  const [csv] = await Promise.all([page.waitForEvent('download'), page.click('[data-act=csv]')]);
  const csvText = fs.readFileSync(await csv.path(), 'utf8');
  assert.match(csvText, /"Sale"/); assert.match(csvText, /"Expense"/);

  // 10. Backup, wipe, restore round-trip
  await page.goto(URL + '#/settings');
  const [bk] = await Promise.all([page.waitForEvent('download'), page.click('[data-act=backup]')]);
  const bkPath = await bk.path();
  const before = JSON.parse(fs.readFileSync(bkPath, 'utf8'));
  assert.strictEqual(before.sales.length, 3);
  await page.goto(URL + '#/settings');
  page.__promptAnswer = 'futa';
  await page.click('[data-act=wipe]');
  await page.waitForSelector('.big.sale');
  assert.match(await text(page, '.stats'), /KSh 0/);
  await page.goto(URL + '#/settings');
  await page.setInputFiles('#restoreFile', bkPath);
  await page.waitForSelector('.big.sale');
  assert.match(await text(page, '.stats'), /KSh 6,460/);
  await page.goto(URL + '#/settings');
  await page.setInputFiles('#restoreFile', { name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"x":1}') });
  assert.match(await text(page, '#toast'), /si nakala/);
  // Tampered backup: script in date/id/method fields must render as text, never run.
  const evil = JSON.parse(JSON.stringify(before));
  const x = '"><img src=x onerror=alert(1)>';
  evil.sales[0].date = x; evil.sales[0].method = x; evil.debts[0].due = x; evil.debts[0].date = x; evil.debts[0].id = x;
  evil.expenses[0].cat = x; evil.expenses[0].date = '2026-11-01' + x;
  await page.goto(URL + '#/settings');
  await page.setInputFiles('#restoreFile', { name: 'evil.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(evil)) });
  await page.waitForSelector('.big.sale');
  for (const h of ['#/debts', '#/report']) { await page.goto(URL + h); await page.waitForTimeout(150); }
  await page.goto(URL + '#/settings');
  await page.setInputFiles('#restoreFile', bkPath);     // put the good data back
  await page.waitForSelector('.big.sale');

  // 11. Delete a record from the report
  await page.goto(URL + '#/report');
  const rowsBefore = await page.locator('[data-act=del]').count();
  await page.locator('[data-act=del]').first().click();
  assert.strictEqual(await page.locator('[data-act=del]').count(), rowsBefore - 1);

  // 12. English + persistence after reload
  await page.goto(URL + '#/settings');
  await page.click('label.choice:has(input[value=en])');
  await page.click('button[type=submit]');
  await page.reload();
  await page.waitForSelector('.big.sale');
  assert.match(await text(page, '.big.sale'), /I sold/);
  await shot(page, 'home-english');
  await page.goto(URL + '#/help');
  await shot(page, 'help-english');

  // 13. SMS parser unit checks
  const p = await page.evaluate(() => [
    window.__biashara.parseMpesa('SKN2RTY321 Confirmed. Ksh8,000.00 sent to JANE WAMBUI 0722000000 on 5/11/26 at 9:00 AM.'),
    window.__biashara.parseMpesa('SKJ9XYZ789 Confirmed. Ksh12,500.00 paid to JUMLA WHOLESALERS. on 2/11/26 at 1:10 PM.'),
    window.__biashara.parseMpesa('hello there'),
    window.__biashara.intlPhone('+254 712 345 678'), window.__biashara.intlPhone('0112345678'), window.__biashara.intlPhone('12')
  ]);
  assert.deepStrictEqual([p[0].dir, p[0].amount, p[0].name, p[0].code], ['out', 8000, 'JANE WAMBUI', 'SKN2RTY321']);
  assert.deepStrictEqual([p[1].dir, p[1].amount, p[1].name], ['out', 12500, 'JUMLA WHOLESALERS']);
  assert.strictEqual(p[2], null);
  assert.deepStrictEqual(p.slice(3), ['254712345678', '254112345678', '']);

  // 14. Small old phone + desktop: no horizontal scroll
  for (const vp of [{ width: 320, height: 568 }, { width: 1280, height: 800 }]) {
    await page.setViewportSize(vp);
    for (const h of ['#/', '#/sale', '#/expense', '#/report', '#/debts', '#/settings']) {
      await page.goto(URL + h);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      assert.ok(over <= 0, `horizontal scroll ${over}px at ${vp.width} ${h}`);
    }
    await page.goto(URL + '#/expense');
    await shot(page, 'expense-' + vp.width);
  }

  assert.deepStrictEqual(errors, [], 'page errors: ' + errors.join('\n'));
  await browser.close();
  console.log('ALL TESTS PASSED');
})().catch(e => { console.error('TEST FAILED:', e); process.exit(1); });
