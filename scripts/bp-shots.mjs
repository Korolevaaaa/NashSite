import puppeteer from 'puppeteer-core'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = 'http://localhost:5182/'
const OUT = 'C:/Проекты WEB/NashSite/shots'

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 })
await new Promise(r => setTimeout(r, 1200))

await page.screenshot({ path: `${OUT}/bp-full.png`, fullPage: true })
await page.screenshot({ path: `${OUT}/bp-hero.png` })

for (const [name, sel] of [['menu', '#menu'], ['about', '#about'], ['insta', '.insta'], ['contacts', '#contacts']]) {
  const el = await page.$(sel)
  if (el) {
    await el.scrollIntoView()
    await new Promise(r => setTimeout(r, 700))
    await el.screenshot({ path: `${OUT}/bp-${name}.png` })
  } else console.log('MISSING', sel)
}

const h = await page.evaluate(() => document.body.scrollHeight)
console.log('page height:', h)
await browser.close()
console.log('done')
