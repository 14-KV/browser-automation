const { chromium } = require('playwright');

function safeUrl(value) {
  try {
    const u = new URL(value);
    return `${u.origin}${u.pathname}`;
  } catch {
    return '(unavailable)';
  }
}

(async () => {
  const browser = await chromium.connectOverCDP('http://localhost:9222');

  for (const context of browser.contexts()) {
    for (const page of context.pages()) {

      console.log('\nMonitoring:', safeUrl(page.url()));

      page.on('framenavigated', frame => {
        if (frame === page.mainFrame()) {
          console.log('NAVIGATION:', safeUrl(frame.url()));
        }
      });

      page.on('request', request => {
        if (request.url().includes('udiseplus.gov.in')) {
          console.log('\nREQUEST:', request.method(), safeUrl(request.url()));
          console.log('Navigation request:', request.isNavigationRequest());
          console.log('Resource type:', request.resourceType());

          const previous = request.redirectedFrom();
          if (previous) {
            console.log('REDIRECTED FROM:', safeUrl(previous.url()));
          }
        }
      });

      page.on('response', async response => {
        if (response.url().includes('udiseplus.gov.in')) {
          console.log('\nRESPONSE:', response.status(), safeUrl(response.url()));

          const headers = await response.allHeaders();
          if (headers.location) {
            console.log('LOCATION HEADER:', safeUrl(headers.location));
          }
        }
      });

      page.on('requestfailed', request => {
        if (request.url().includes('udiseplus.gov.in')) {
          console.log('\nFAILED:', safeUrl(request.url()));
          console.log('ERROR:', request.failure()?.errorText);
        }
      });
    }
  }

  console.log('\nMonitoring started. Click Student Module now.');
  await new Promise(() => {});
})();