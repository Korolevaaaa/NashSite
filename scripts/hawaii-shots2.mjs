import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const pg = await b.newPage();
await pg.setViewport({ width: 1440, height: 900 });
await pg.goto("https://hawaii22.ru", { waitUntil: "networkidle2", timeout: 40000 });
await new Promise((r) => setTimeout(r, 2500));
// принять куки
await pg.evaluate(() => {
  const t = [...document.querySelectorAll("button,a")].find((x) => /принять/i.test(x.textContent));
  if (t) t.click();
});
await new Promise((r) => setTimeout(r, 1200));

const shotEl = async (name, sel) => {
  const el = await pg.$(sel);
  if (!el) return console.log("MISS", sel);
  await el.evaluate((e) => e.scrollIntoView({ block: "start" }));
  await new Promise((r) => setTimeout(r, 1600));
  await pg.screenshot({ path: `public/cases/hawaii22/${name}.png` });
  console.log(name);
};
await pg.evaluate(() => window.scrollTo(0, 0));
await new Promise((r) => setTimeout(r, 1200));
await pg.screenshot({ path: "public/cases/hawaii22/hero.png" });
await shotEl("houses", "#houses");
await shotEl("services", "#services");
await shotEl("map", "#map");
await shotEl("reviews", "#reviews");
await shotEl("contacts", "#contacts");

// что внутри карточки домика — ищем кликабельное
const info = await pg.evaluate(() => {
  const h = document.querySelector("#houses");
  const els = [...h.querySelectorAll("a,button,[role=button],div")].filter(e => /подробнее|бронь|свободен|гостей/i.test(e.textContent) && e.children.length < 6).slice(0,8);
  return els.map(e => `${e.tagName}.${e.className.toString().slice(0,40)} :: ${e.textContent.trim().slice(0,50)}`);
});
console.log(JSON.stringify(info, null, 1));
// клик по карточке домика
const clicked = await pg.evaluate(() => {
  const h = document.querySelector("#houses");
  const card = [...h.querySelectorAll("*")].find(e => /подробнее/i.test(e.textContent) && e.children.length <= 3);
  if (card) { card.click(); return card.textContent.trim().slice(0,60); }
  return null;
});
console.log("clicked:", clicked);
await new Promise((r) => setTimeout(r, 2500));
await pg.screenshot({ path: "public/cases/hawaii22/booking.png" });
console.log("url:", pg.url());
await b.close();
