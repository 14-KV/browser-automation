const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP('http://localhost:9222');

  for (const [i, context] of browser.contexts().entries()) {
    console.log(`\nContext ${i}`);

    for (const [j, page] of context.pages().entries()) {
      console.log(`Page ${j}: ${page.url()}`);
      console.log(`Title: ${await page.title()}`);
    }
  }

  await browser.close();
})();
