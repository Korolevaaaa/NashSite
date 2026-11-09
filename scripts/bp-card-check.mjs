import puppeteer from 'puppeteer-core'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto('http://localhost:5175/#/templates', { waitUntil: 'networkidle2', timeout: 15000 })
await new Promise(r => setTimeout(r, 6000))
const info = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('a[href*="#/template/"], a[href*="template/"]')].map(a => a.href)
  const text = document.body.innerText
  return {
    hash: location.hash,
    hasKartoshka: text.includes('Крошка-картошка'),
    hasEda: text.includes('Еда и доставка'),
    tplLinks: cards.filter(h => h.includes('kroshka')).length,
    price: text.includes('от 20 000'),
  }
})
console.log(JSON.stringify(info, null, 2))
const el = await page.evaluateHandle(() => {
  const nodes = [...document.querySelectorAll('a')]
  return nodes.find(a => a.href.includes('kroshka')) || null
})
if (el) {
  const box = await el.asElement().boundingBox()
  if (box) {
    await el.asElement().scrollIntoView()
    await new Promise(r => setTimeout(r, 600))
    await page.screenshot({ path: 'shots/bp-card.png', clip: { x: Math.max(0, box.x - 40), y: Math.max(0, box.y - 40), width: Math.min(1400, box.width + 80), height: Math.min(900, box.height + 80) } })
  }
}
await browser.close()
console.log('done')
