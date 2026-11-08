// Render product/guide.html to product/Biashara-Records-Kit-Guide.pdf
// Run: node scripts/build_guide_pdf.js
const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve(__dirname, '../product/guide.html'));
  await page.pdf({
    path: path.resolve(__dirname, '../product/Biashara-Records-Kit-Guide.pdf'),
    format: 'A4', printBackground: true, preferCSSPageSize: true,
    displayHeaderFooter: true, headerTemplate: '<span></span>',
    footerTemplate: '<div style="font-size:8px;width:100%;text-align:center;color:#888">Biashara Records Kit · page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
  });
  await browser.close();
  console.log('pdf done');
})();
