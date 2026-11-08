// Render the guide HTML files to PDF (English and Kiswahili).
// Run: node scripts/build_guide_pdf.js
const path = require('path');
const { chromium } = require('playwright');
const GUIDES = [
  ['guide.html', 'Biashara-Records-Kit-Guide.pdf', 'page'],
  ['guide_sw.html', 'Biashara-Records-Kit-Mwongozo-Kiswahili.pdf', 'ukurasa'],
];
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const [src, out, word] of GUIDES) {
    await page.goto('file://' + path.resolve(__dirname, '../product', src));
    await page.pdf({
      path: path.resolve(__dirname, '../product', out),
      format: 'A4', printBackground: true, preferCSSPageSize: true,
      displayHeaderFooter: true, headerTemplate: '<span></span>',
      footerTemplate: `<div style="font-size:8px;width:100%;text-align:center;color:#888">Biashara Records Kit · ${word} <span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
    });
    console.log('pdf done:', out);
  }
  await browser.close();
})();
