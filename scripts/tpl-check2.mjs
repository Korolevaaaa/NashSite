import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
});
const pg = await b.newPage();
await pg.setViewport({ width: 1440, height: 900 });
// storefront card clickability check
await pg.goto('http://localhost:5175/#templates', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 1800));
await pg.evaluate(() => document.querySelector('#templates')?.scrollIntoView());
await new Promise(r => setTimeout(r, 1200));
await pg.screenshot({ path: 'shots/tpl2-card.png' });
await pg.click('a.sf-card__media');
await new Promise(r => setTimeout(r, 1500));
await pg.screenshot({ path: 'shots/tpl2-page-top.png' });
console.log('url:', pg.url());
console.log('title:', await pg.title());
// scroll to upsell section
await pg.evaluate(() => {
  const h = [...document.querySelectorAll('h2')].find(x => x.textContent.includes('дополнительно'));
  h?.scrollIntoView({ block: 'center' });
});
await new Promise(r => setTimeout(r, 1000));
await pg.screenshot({ path: 'shots/tpl2-upsell.png' });
await b.close();
console.log('done');
