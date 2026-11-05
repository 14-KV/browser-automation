const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.connectOverCDP(
    'http://localhost:9222'
  );

  for (const context of browser.contexts()) {

    context.on('page', async page => {
      console.log('\n===== NEW PAGE CREATED =====');

      page.on('request', request => {
        if (request.url().includes('udiseplus.gov.in')) {
          console.log(
            'REQUEST:',
            request.method(),
            request.url().split('?')[0]
          );
        }
      });

      page.on('response', response => {
        if (response.url().includes('udiseplus.gov.in')) {
          console.log(
            'RESPONSE:',
            response.status(),
            response.url().split('?')[0]
          );

          if (response.status() >= 300 && response.status() < 400) {
            console.log('REDIRECT RESPONSE DETECTED');
          }
        }
      });

      page.on('requestfailed', request => {
        if (request.url().includes('udiseplus.gov.in')) {
          console.log(
            'FAILED:',
            request.url().split('?')[0],
            request.failure()?.errorText
          );
        }
      });

      page.on('framenavigated', frame => {
        if (frame === page.mainFrame()) {
          console.log(
            'NAVIGATION:',
            frame.url().split('?')[0]
          );
        }
      });

      console.log('Initial URL:', page.url().split('?')[0]);
    });

  }

  console.log('Monitoring new pages. Click Student Module once.');

  await new Promise(() => {});
})();
