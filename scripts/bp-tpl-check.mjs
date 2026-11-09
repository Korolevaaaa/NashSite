import puppeteer from 'puppeteer-core'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
for (const port of [5175, 5173]) {
  try {
    await page.goto(`http://localhost:${port}/#/template/kroshka-kartoshka`, { waitUntil: 'networkidle2', timeout: 8000 })
    const title = await page.title()
    const h1 = await page.$eval('h1', el => el.textContent.trim()).catch(() => null)
    const imgs = await page.$$eval('img', els => els.map(i => i.getAttribute('src')))
    const broken = imgs.filter(s => s && s.includes('kroshka'))
    console.log(`port ${port}: title="${title}" h1="${(h1||'').slice(0,60)}" tplImgs=${broken.length}`)
    await page.screenshot({ path: 'shots/bp-tpl-page.png', fullPage: false })
    await page.goto(`http://localhost:${port}/#/templates`, { waitUntil: 'networkidle2', timeout: 8000 })
    await new Promise(r => setTimeout(r, 800))
    await page.screenshot({ path: 'shots/bp-storefront.png' })
    break
  } catch (e) { console.log(`port ${port}: ${e.message.slice(0,60)}`) }
}
await browser.close()
