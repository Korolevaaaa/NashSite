import puppeteer from 'puppeteer-core'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto('http://localhost:5175/#/template/restoran', { waitUntil: 'networkidle2', timeout: 15000 })
await new Promise(r => setTimeout(r, 4000))
console.log('title:', await page.title())
console.log('h1:', await page.$eval('h1', e => e.textContent.trim().slice(0, 70)))
await page.screenshot({ path: 'shots/fc-tpl-page.png' })
await browser.close()
