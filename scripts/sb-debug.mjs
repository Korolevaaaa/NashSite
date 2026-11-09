import puppeteer from 'puppeteer-core'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
page.on('console', m => { if (m.type() === 'error') console.log('ERR:', m.text().slice(0, 300)) })
page.on('pageerror', e => console.log('PAGEERR:', e.message.slice(0, 300)))
await page.goto('http://localhost:5183/', { waitUntil: 'networkidle0', timeout: 30000 })
await new Promise(r => setTimeout(r, 3000))
console.log('root children:', await page.evaluate(() => document.getElementById('root')?.children.length))
await browser.close()
