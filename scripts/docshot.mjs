import puppeteer from 'puppeteer-core';

const url = process.argv[2];
const out = process.argv[3] || 'shots/doc-pres.png';
const full = process.argv[4] === 'full';

const b = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
});
const pg = await b.newPage();
await pg.setViewport({ width: 1400, height: 900 });
await pg.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));
await pg.screenshot({ path: out, fullPage: full });
await b.close();
console.log('done', out);
