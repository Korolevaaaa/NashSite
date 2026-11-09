import puppeteer from 'puppeteer-core';

const b = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
});
const pg = await b.newPage();
await pg.setViewport({ width: 1440, height: 900 });
await pg.goto('http://localhost:5176/', { waitUntil: 'networkidle0', timeout: 45000 });
await new Promise(r => setTimeout(r, 3000));

const sections = ['#menu', '#how', '#delivery', '#contacts'];
for (const sel of sections) {
  const el = await pg.$(sel);
  if (!el) { console.log('missing', sel); continue; }
  await el.evaluate(e => e.scrollIntoView({ block: 'start' }));
  await new Promise(r => setTimeout(r, 1400));
  const name = sel.slice(1);
  await pg.screenshot({ path: `shots/resto-sec-${name}.png` });
  console.log('shot', name);
}
// cart: click a "В корзину" button then open cart
await pg.evaluate(() => {
  const btns = [...document.querySelectorAll('button')];
  const b = btns.find(x => /корзин/i.test(x.textContent || ''));
  b?.click();
});
await new Promise(r => setTimeout(r, 800));
await pg.evaluate(() => {
  const btns = [...document.querySelectorAll('a,button')];
  const b = btns.find(x => /Корзина/i.test(x.textContent || ''));
  b?.click();
});
await new Promise(r => setTimeout(r, 1400));
await pg.screenshot({ path: 'shots/resto-cart.png' });
console.log('shot cart');
await b.close();
console.log('done');
