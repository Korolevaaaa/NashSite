import puppeteer from 'puppeteer-core'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = 'http://localhost:5183/'
const OUT = 'C:/Проекты WEB/NashSite/shots'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 })
await new Promise(r => setTimeout(r, 2000))
await page.screenshot({ path: `${OUT}/sb-full.png`, fullPage: true })
await page.screenshot({ path: `${OUT}/sb-hero.png` })
for (const [name, sel] of [['menu', '#menu'], ['about', '#about'], ['order', '#order'], ['contacts', '#contacts']]) {
  const ok = await page.evaluate(s => { const el = document.querySelector(s); if (el) { el.scrollIntoView({ block: 'center' }); return true } return false }, sel)
  if (ok) { await new Promise(r => setTimeout(r, 900)); await page.screenshot({ path: `${OUT}/sb-${name}.png` }) }
  else console.log('MISSING', sel)
}
const err = await page.evaluate(() => document.body.innerText.slice(0, 100))
console.log('body:', err)
await browser.close()
console.log('done')
