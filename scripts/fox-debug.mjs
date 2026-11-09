import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' })
const pg = await b.newPage()
pg.on('console', m => console.log('CONSOLE:', m.type(), m.text().slice(0, 300)))
pg.on('pageerror', e => console.log('PAGEERROR:', String(e).slice(0, 500)))
await pg.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 60000 })
await new Promise(r => setTimeout(r, 3000))
console.log(await pg.evaluate(() => ({ cinematic: !!document.querySelector('.cinematic'), root: document.querySelector('#root')?.children.length, classes: [...document.querySelectorAll('main section')].map(s => s.className.slice(0, 40)) })))
await b.close()
