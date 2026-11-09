import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const pg = await b.newPage();
await pg.setViewport({ width: 1440, height: 900 });
await pg.goto("http://localhost:5174/", { waitUntil: "networkidle2", timeout: 30000 });
await new Promise((r) => setTimeout(r, 2200));
for (const id of ["services","doctors","cases","contacts"]) {
  await pg.evaluate((i) => document.getElementById(i)?.scrollIntoView(), id);
  await new Promise((r) => setTimeout(r, 1600));
  await pg.screenshot({ path: `shots/karat-sec-${id}.jpg` });
}
// открыть запись
await pg.evaluate(() => window.scrollTo(0,0));
await new Promise((r) => setTimeout(r, 800));
await pg.evaluate(() => [...document.querySelectorAll("a,button")].find(e => /записаться/i.test(e.textContent))?.click());
await new Promise((r) => setTimeout(r, 2200));
await pg.screenshot({ path: "shots/karat-booking.jpg" });
await b.close();
console.log("done");
