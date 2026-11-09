import puppeteer from 'puppeteer-core'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto('http://localhost:5175/#/templates', { waitUntil: 'networkidle2', timeout: 15000 })
await new Promise(r => setTimeout(r, 6000))
const el = await page.evaluateHandle(() => [...document.querySelectorAll('a')].find(a => a.href.includes('kroshka')))
if (el) {
  await el.asElement().scrollIntoView()
  await new Promise(r => setTimeout(r, 900))
  const box = await el.asElement().boundingBox()
  if (box) await page.screenshot({ path: 'shots/bp-cover-card.png', clip: { x: Math.max(0, box.x - 20), y: Math.max(0, box.y - 20), width: Math.min(1400, box.width + 40), height: Math.min(900, box.height + 40) } })
}
await browser.close()
console.log('done')
