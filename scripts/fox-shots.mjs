import puppeteer from 'puppeteer-core'

const b = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
})
const pg = await b.newPage()
await pg.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await pg.goto('http://localhost:5181/', { waitUntil: 'networkidle2', timeout: 90000 })
await new Promise((r) => setTimeout(r, 4000))

await pg.screenshot({ path: 'shots/fox-hero.png' })
console.log('hero')

// cinematic scene ~2 (scroll to ~45% of pinned section)
await pg.evaluate(() => {
  const sec = document.querySelector('.cinematic')
  const travel = sec.offsetHeight - innerHeight
  window.scrollTo(0, sec.offsetTop + travel * 0.45)
})
await new Promise((r) => setTimeout(r, 2500))
await pg.screenshot({ path: 'shots/fox-scene2.png' })
console.log('scene2')

// scene ~4
await pg.evaluate(() => {
  const sec = document.querySelector('.cinematic')
  const travel = sec.offsetHeight - innerHeight
  window.scrollTo(0, sec.offsetTop + travel * 0.95)
})
await new Promise((r) => setTimeout(r, 2500))
await pg.screenshot({ path: 'shots/fox-scene4.png' })
console.log('scene4')

// houses
await pg.evaluate(() => document.querySelector('#houses')?.scrollIntoView({ block: 'start' }))
await new Promise((r) => setTimeout(r, 1800))
await pg.screenshot({ path: 'shots/fox-houses.png' })
console.log('houses')

// ritual (sauna+chan)
await pg.evaluate(() => document.querySelector('#price')?.scrollIntoView({ block: 'start' }))
await new Promise((r) => setTimeout(r, 1600))
await pg.screenshot({ path: 'shots/fox-ritual.png' })
console.log('ritual')

// booking modal
await pg.evaluate(() => document.querySelector('#location')?.scrollIntoView({ block: 'start' }))
await new Promise((r) => setTimeout(r, 1200))
await pg.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find((x) => x.textContent.includes('Выбрать дом и даты'))
  btn?.click()
})
await new Promise((r) => setTimeout(r, 1200))
await pg.screenshot({ path: 'shots/fox-booking.png' })
console.log('booking')

// close modal, footer
await pg.keyboard.press('Escape')
await pg.evaluate(() => document.querySelector('.booking-panel__close')?.click())
await new Promise((r) => setTimeout(r, 400))
await pg.screenshot({ path: 'shots/fox-footer.png' })
console.log('footer')

await b.close()
console.log('done')
