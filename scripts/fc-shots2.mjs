import puppeteer from 'puppeteer-core'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = 'http://localhost:5184/'
const OUT = 'C:/Проекты WEB/NashSite/shots'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 40000 })
await new Promise(r => setTimeout(r, 2500))
await page.evaluate(async () => {
  const h = document.body.scrollHeight
  for (let y = 0; y <= h; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150)) }
  window.scrollTo(0, 0)
})
await new Promise(r => setTimeout(r, 1500))
await page.addStyleTag({ content: '.reveal{opacity:1 !important;transform:none !important;transition:none !important}' })
await new Promise(r => setTimeout(r, 400))
await page.screenshot({ path: `${OUT}/fc-full.png`, fullPage: true })
await browser.close()
console.log('done')
