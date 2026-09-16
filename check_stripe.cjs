const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.text().includes('Ready event:')) {
      Promise.all(msg.args().map(arg => arg.jsonValue())).then(args => {
        console.log('[BROWSER CONSOLE] Ready event data:', JSON.stringify(args, null, 2));
      });
    }
  });

  console.log('Navigating to checkout...');
  await page.goto('http://localhost:5173/checkout', { waitUntil: 'networkidle2' });
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  await browser.close();
  console.log('Done.');
})();
