import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
})
const pg = await b.newPage()
await pg.setViewport({ width: 1440, height: 900 })
await pg.goto('http://localhost:5175/#/template/glamping-gory', { waitUntil: 'networkidle0', timeout: 30000 })
await new Promise((r) => setTimeout(r, 1500))
console.log('TITLE:', await pg.title())
await pg.screenshot({ path: 'shots/ueg-tpl.png' })
await pg.goto('http://localhost:5175/#templates', { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 1200))
await pg.evaluate(() => document.querySelector('#templates')?.scrollIntoView())
await new Promise((r) => setTimeout(r, 900))
await pg.screenshot({ path: 'shots/ueg-card.png' })
await b.close()
console.log('done')
