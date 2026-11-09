import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
});
const pg = await b.newPage();
await pg.setViewport({ width: 1440, height: 900 });
await pg.goto('http://localhost:5175/#/template/dostavka-sushi', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));
await pg.screenshot({ path: 'shots/tpl-1.png' });
console.log('title:', await pg.title());
for (const [i, y] of [[2, 1400], [3, 3200], [4, 5200]]) {
  await pg.evaluate(v => window.scrollTo(0, v), y);
  await new Promise(r => setTimeout(r, 1000));
  await pg.screenshot({ path: `shots/tpl-${i}.png` });
}
await b.close();
console.log('done');
