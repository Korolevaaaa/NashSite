import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
})
const pg = await b.newPage()
await pg.setViewport({ width: 1440, height: 900 })
await pg.goto('http://localhost:5173/#/template/sfera-dom', { waitUntil: 'networkidle0', timeout: 30000 })
await new Promise((r) => setTimeout(r, 1500))
console.log('TITLE:', await pg.title())
await pg.screenshot({ path: 'shots/fox-tpl.png' })
await pg.evaluate(() => window.scrollTo(0, 700))
await new Promise((r) => setTimeout(r, 800))
await pg.screenshot({ path: 'shots/fox-tpl-demo.png' })
await b.close()
console.log('done')
