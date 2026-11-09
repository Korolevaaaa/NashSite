import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
});
const pg = await b.newPage();
await pg.setViewport({ width: 1440, height: 900 });
await pg.goto('http://localhost:5175/#/template/dostavka-sushi', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));
await pg.evaluate(() => {
  const f = [...document.querySelectorAll('.tpl-shot .tpl-zoom')][1];
  f?.scrollIntoView({ block: 'center' });
});
await new Promise(r => setTimeout(r, 800));
await pg.click('.tpl-shot .tpl-zoom');
await new Promise(r => setTimeout(r, 800));
await pg.screenshot({ path: 'shots/tpl-zoom-open.png' });
console.log('lightbox:', await pg.$('.case-lightbox') ? 'OPEN' : 'MISSING');
await pg.keyboard.press('Escape');
await new Promise(r => setTimeout(r, 500));
console.log('after esc:', await pg.$('.case-lightbox') ? 'STILL OPEN' : 'CLOSED');
await b.close();
