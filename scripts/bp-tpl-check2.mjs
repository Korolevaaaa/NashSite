import puppeteer from 'puppeteer-core'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto('http://localhost:5175/#/templates', { waitUntil: 'networkidle2', timeout: 15000 })
await new Promise(r => setTimeout(r, 4000))
await page.screenshot({ path: 'shots/bp-storefront.png' })
await page.goto('http://localhost:5175/#/template/kroshka-kartoshka', { waitUntil: 'networkidle2', timeout: 15000 })
await new Promise(r => setTimeout(r, 4000))
await page.screenshot({ path: 'shots/bp-tpl-page.png' })
await browser.close()
console.log('done')
