import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
})
const pg = await b.newPage()
await pg.setViewport({ width: 1440, height: 900 })
await pg.goto('http://localhost:5173/#templates', { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 1200))
await pg.evaluate(() => document.querySelector('#templates')?.scrollIntoView())
await new Promise((r) => setTimeout(r, 900))
await pg.screenshot({ path: 'shots/fox-cover.png' })
await b.close()
console.log('done')
