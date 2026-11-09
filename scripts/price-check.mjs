import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' })
const pg = await b.newPage()
await pg.setViewport({ width: 1440, height: 1400 })
await pg.goto('http://localhost:5173/#templates', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 1200))
const prices = await pg.evaluate(() => [...document.querySelectorAll('#templates .sf-card')].map(c => ({
  name: c.querySelector('h3, .sf-card__name')?.textContent?.trim(),
  price: c.querySelector('.sf-card__price')?.textContent?.trim(),
})))
console.log(prices)
await pg.screenshot({ path: 'shots/price-check.png', fullPage: false })
await b.close()
