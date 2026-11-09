import puppeteer from 'puppeteer-core'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto('http://localhost:5175/#/templates', { waitUntil: 'networkidle2', timeout: 15000 })
await new Promise(r => setTimeout(r, 6000))
await page.evaluate(() => {
  const a = [...document.querySelectorAll('a')].find(a => a.href.includes('smash'))
  if (a) a.scrollIntoView({ block: 'center' })
})
await new Promise(r => setTimeout(r, 1000))
await page.screenshot({ path: 'shots/sb-cover-card.png' })
const info = await page.evaluate(() => {
  const a = [...document.querySelectorAll('a')].find(a => a.href.includes('smash'))
  const img = a?.querySelector('img')
  return img ? { src: img.src, ok: img.complete && img.naturalWidth > 0 } : null
})
console.log(JSON.stringify(info))
await browser.close()
