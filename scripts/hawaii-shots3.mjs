import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const pg = await b.newPage();
await pg.setViewport({ width: 1440, height: 900 });
await pg.goto("https://hawaii22.ru", { waitUntil: "networkidle2", timeout: 40000 });
await new Promise((r) => setTimeout(r, 2200));
await pg.evaluate(() => {
  const t = [...document.querySelectorAll("button,a")].find((x) => /принять/i.test(x.textContent));
  if (t) t.click();
  document.querySelector("#houses article")?.scrollIntoView({ block: "center" });
});
await new Promise((r) => setTimeout(r, 1500));
await pg.evaluate(() => document.querySelector("#houses article")?.click());
await new Promise((r) => setTimeout(r, 2500));
console.log("url:", pg.url());
await pg.screenshot({ path: "public/cases/hawaii22/house-modal.png" });
console.log("done");
await b.close();
