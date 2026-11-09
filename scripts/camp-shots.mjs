import puppeteer from 'puppeteer-core'

const b = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
})
const pg = await b.newPage()
await pg.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await pg.goto('http://localhost:5177/', { waitUntil: 'networkidle2', timeout: 60000 })
await new Promise((r) => setTimeout(r, 2500))

// scroll through page to trigger reveal animations + lazy images
await pg.evaluate(async () => {
  const h = document.body.scrollHeight
  for (let y = 0; y < h; y += 700) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 120))
  }
  window.scrollTo(0, 0)
  await new Promise((r) => setTimeout(r, 800))
})

await pg.screenshot({ path: 'shots/camp-full.png', fullPage: true })
console.log('full page done')

// hero (viewport)
await pg.screenshot({ path: 'shots/camp-hero.png' })

// sections by anchor
const sections = ['#accommodation', '#impressions', '#about', '#contacts']
const names = ['houses', 'impressions', 'about', 'contacts']
for (let i = 0; i < sections.length; i++) {
  await pg.evaluate((sel) => {
    document.querySelector(sel)?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, sections[i])
  await new Promise((r) => setTimeout(r, 1400))
  await pg.screenshot({ path: `shots/camp-${names[i]}.png` })
  console.log(names[i])
}

// booking modal
await pg.evaluate(() => window.scrollTo(0, 0))
await new Promise((r) => setTimeout(r, 800))
const btns = await pg.$$('button')
for (const bt of btns) {
  const t = await bt.evaluate((el) => el.textContent)
  if (t && t.includes('Забронировать даты')) {
    await bt.click()
    break
  }
}
await new Promise((r) => setTimeout(r, 1200))
await pg.screenshot({ path: 'shots/camp-booking.png' })
console.log('booking')

await b.close()
console.log('done')
