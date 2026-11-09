import puppeteer from 'puppeteer-core'

const b = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
})
const pg = await b.newPage()
await pg.setViewport({ width: 1440, height: 900 })
await pg.goto('http://localhost:5177/', { waitUntil: 'networkidle2', timeout: 60000 })
await new Promise((r) => setTimeout(r, 2000))
await pg.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find((x) =>
    x.textContent.includes('Забронировать даты'),
  )
  btn?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
})
await new Promise((r) => setTimeout(r, 1200))
await pg.screenshot({ path: 'shots/camp-booking.png' })
await b.close()
console.log('done')
