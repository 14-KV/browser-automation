const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({
        headless: false,
        args: [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--start-maximized',
        '--remote-debugging-port=9222'
        ]
    });

    const context = await browser.newContext({
        viewport: null
    });

    const page = await context.newPage();

    await page.goto(
        'https://lpsadmission.com/public/admin',
        {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        }
    );

    console.log('UDISE+ opened in remote browser.');

})();
