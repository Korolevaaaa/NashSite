import puppeteer from 'puppeteer-core'

const b = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
})
const pg = await b.newPage()
await pg.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await pg.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 90000 })
await new Promise((r) => setTimeout(r, 3000))

// scroll through to trigger reveals + lazy images
await pg.evaluate(async () => {
  const h = document.body.scrollHeight
  for (let y = 0; y < h; y += 600) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 150))
  }
  window.scrollTo(0, 0)
  await new Promise((r) => setTimeout(r, 1000))
})

await pg.screenshot({ path: 'shots/ueg-full.png', fullPage: true })
console.log('full done')

await pg.screenshot({ path: 'shots/ueg-hero.png' })

const secs = [
  ['#stay', 'stay'],
  ['#atmosphere', 'gallery'],
  ['#activities', 'activities'],
  ['#location', 'location'],
  ['#contact', 'booking'],
]
for (const [sel, name] of secs) {
  await pg.evaluate((s) => {
    document.querySelector(s)?.scrollIntoView({ behavior: 'instant', block: 'start' })
    window.scrollBy(0, -40)
  }, sel)
  await new Promise((r) => setTimeout(r, 1600))
  await pg.screenshot({ path: `shots/ueg-${name}.png` })
  console.log(name)
}

// gallery lightbox: open first gallery image
await pg.evaluate(() => {
  document.querySelector('#atmosphere')?.scrollIntoView({ behavior: 'instant' })
})
await new Promise((r) => setTimeout(r, 1200))
await pg.evaluate(() => {
  const btn = document.querySelector('#atmosphere button[aria-label^="Открыть фотографию"]')
  btn?.click()
})
await new Promise((r) => setTimeout(r, 900))
await pg.screenshot({ path: 'shots/ueg-lightbox.png' })
console.log('lightbox')

await b.close()
console.log('done')
