import puppeteer from 'puppeteer-core'

const b = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
})
const pg = await b.newPage()
await pg.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await pg.goto('http://localhost:5180/', { waitUntil: 'networkidle2', timeout: 90000 })
await new Promise((r) => setTimeout(r, 4000))

// hero
await pg.screenshot({ path: 'shots/sw-hero.png' })
console.log('hero')

// scroll through for lazy stuff
await pg.evaluate(async () => {
  const h = document.body.scrollHeight
  for (let y = 0; y < h; y += 700) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 150))
  }
})
await pg.evaluate(() => window.scrollTo(0, 0))
await new Promise((r) => setTimeout(r, 800))
await pg.screenshot({ path: 'shots/sw-full.png', fullPage: true })
console.log('full')

// configurator — default state
await pg.evaluate(() => document.querySelector('#config')?.scrollIntoView({ block: 'start' }))
await new Promise((r) => setTimeout(r, 1600))
await pg.screenshot({ path: 'shots/sw-config.png' })
console.log('config')

// switch wall color — click a swatch (2nd or 3rd)
await pg.evaluate(() => {
  const sw = document.querySelectorAll('#swatches button, #swatches .swatch, #swatches [role=button]')
  sw[2]?.click() || sw[1]?.click()
})
await new Promise((r) => setTimeout(r, 900))
await pg.screenshot({ path: 'shots/sw-config2.png' })
console.log('config2')

// toggle open/closed if there is a control
await pg.evaluate(() => {
  const btns = [...document.querySelectorAll('#config button, #config [role=button]')]
  const t = btns.find((x) => /закрыт|открыт|приоткр/i.test(x.textContent))
  t?.click()
})
await new Promise((r) => setTimeout(r, 900))
await pg.screenshot({ path: 'shots/sw-config3.png' })
console.log('config3')

// catalog
await pg.evaluate(() => document.querySelector('#catalog')?.scrollIntoView({ block: 'start' }))
await new Promise((r) => setTimeout(r, 1400))
await pg.screenshot({ path: 'shots/sw-catalog.png' })
console.log('catalog')

// add to cart → open cart if exists
await pg.evaluate(() => {
  const btns = [...document.querySelectorAll('#catalog button')]
  const add = btns.find((x) => /корзин|добавить|купить/i.test(x.textContent))
  add?.click()
})
await new Promise((r) => setTimeout(r, 800))
await pg.evaluate(() => {
  const btns = [...document.querySelectorAll('header button, header a')]
  const cart = btns.find((x) => /корзин|cart/i.test(x.textContent) || /cart/i.test(x.className + ' ' + (x.id || '')))
  cart?.click()
})
await new Promise((r) => setTimeout(r, 900))
await pg.screenshot({ path: 'shots/sw-cart.png' })
console.log('cart')

// usp + cta
await pg.evaluate(() => document.querySelector('#cta')?.scrollIntoView({ block: 'start' }))
await new Promise((r) => setTimeout(r, 1200))
await pg.screenshot({ path: 'shots/sw-cta.png' })
console.log('cta')

await b.close()
console.log('done')
