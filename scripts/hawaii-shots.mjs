import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const pg = await b.newPage();
await pg.setViewport({ width: 1440, height: 900 });
await pg.goto("https://hawaii22.ru", { waitUntil: "networkidle2", timeout: 40000 });
await new Promise((r) => setTimeout(r, 3000));

const shot = async (name, y) => {
  await pg.evaluate((yy) => window.scrollTo(0, yy), y);
  await new Promise((r) => setTimeout(r, 1600));
  await pg.screenshot({ path: `public/cases/hawaii22/${name}.png` });
  console.log(name);
};
const shotEl = async (name, sel) => {
  const el = await pg.$(sel);
  if (!el) return console.log("MISS", sel);
  await el.evaluate((e) => e.scrollIntoView({ block: "center" }));
  await new Promise((r) => setTimeout(r, 1600));
  await el.screenshot({ path: `public/cases/hawaii22/${name}.png` });
  console.log(name, "(el)");
};

await shot("hero", 0);
await shotEl("about", "#about");
await shotEl("houses", "#houses");
await shotEl("services", "#services");
await shotEl("map", "#map");
await shotEl("reviews", "#reviews");
await shotEl("contacts", "#contacts");

// попытка открыть карточку домика / бронирование
const opened = await pg.evaluate(() => {
  const btns = [...document.querySelectorAll("a,button")];
  const t = btns.find((x) => /подробнее|забронировать|бронь/i.test(x.textContent));
  if (t) { t.click(); return t.textContent.trim(); }
  return null;
});
console.log("clicked:", opened);
await new Promise((r) => setTimeout(r, 2200));
await pg.screenshot({ path: "public/cases/hawaii22/booking.png" });

// мобильный герой
await pg.setViewport({ width: 390, height: 844 });
await pg.goto("https://hawaii22.ru", { waitUntil: "networkidle2", timeout: 40000 });
await new Promise((r) => setTimeout(r, 2500));
await pg.screenshot({ path: "public/cases/hawaii22/mobile-hero.png" });

await b.close();
console.log("done");
