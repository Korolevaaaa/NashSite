import puppeteer from 'puppeteer-core';

const b = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
});
const pg = await b.newPage();
await pg.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await pg.goto('http://localhost:5176/', { waitUntil: 'networkidle0', timeout: 45000 });
await new Promise(r => setTimeout(r, 3500));
// full page
await pg.screenshot({ path: 'shots/resto-full.png', fullPage: true });
// hero viewport
await pg.screenshot({ path: 'shots/resto-hero.png' });
await b.close();
console.log('done');
