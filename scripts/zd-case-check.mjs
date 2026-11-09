import puppeteer from 'puppeteer-core';

const b = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
});
const pg = await b.newPage();
await pg.setViewport({ width: 1440, height: 900 });
await pg.goto('http://localhost:5175/#/case/zetronixdocs', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));
await pg.screenshot({ path: 'shots/zdc-1.png' });
// scroll through the sticky story section
for (const [i, y] of [[2, 1600], [3, 3200], [4, 4800], [5, 6400]]) {
  await pg.evaluate(v => window.scrollTo(0, v), y);
  await new Promise(r => setTimeout(r, 1200));
  await pg.screenshot({ path: `shots/zdc-${i}.png` });
}
await b.close();
console.log('done');
