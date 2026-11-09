import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
});
const pg = await b.newPage();
await pg.setViewport({ width: 1440, height: 900 });
await pg.goto('http://localhost:5175/#/template/dostavka-sushi', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));
await pg.screenshot({ path: 'shots/tpl4-head.png' });
await b.close();
console.log('done');
