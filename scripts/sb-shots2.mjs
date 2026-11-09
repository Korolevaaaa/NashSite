import puppeteer from 'puppeteer-core'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = 'http://localhost:5183/'
const OUT = 'C:/Проекты WEB/NashSite/shots'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 })
await new Promise(r => setTimeout(r, 2000))
// прогоняем скроллом, чтобы reveal-анимации отработали
await page.evaluate(async () => {
  const h = document.body.scrollHeight
  for (let y = 0; y <= h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)) }
  window.scrollTo(0, 0)
})
await new Promise(r => setTimeout(r, 1200))
await page.screenshot({ path: `${OUT}/sb-full.png`, fullPage: true })
for (const [name, sel] of [['menu', '#menu'], ['about', '#about'], ['order', '#order'], ['contacts', '#contacts']]) {
  await page.evaluate(s => { document.querySelector(s)?.scrollIntoView({ block: 'center' }) }, sel)
  await new Promise(r => setTimeout(r, 900))
  await page.screenshot({ path: `${OUT}/sb-${name}.png` })
}
await browser.close()
console.log('done')
