import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const pg = await b.newPage();
await pg.setViewport({ width: 1440, height: 900 });
const pages = [["uslugi","/uslugi"],["tseny","/tseny"],["kejsy","/kejsy"],["otzyvy","/otzyvy"],["kontakty","/kontakty"]];
for (const [name, path] of pages) {
  await pg.goto("http://localhost:5174" + path, { waitUntil: "networkidle2", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2200));
  await pg.screenshot({ path: `shots/karat-${name}.jpg` });
  console.log(name, await pg.title());
}
// прокрутка главной — врачи + запись
await pg.goto("http://localhost:5174/", { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 2000));
const secs = await pg.evaluate(() => [...document.querySelectorAll("section,[id]")].map(s => s.id).filter(Boolean));
console.log("sections:", JSON.stringify(secs.slice(0, 30)));
for (const id of secs.filter(s => /doctor|vrach|zapis|booking|record|team/i.test(s))) {
  await pg.evaluate((i) => document.getElementById(i)?.scrollIntoView(), id);
  await new Promise((r) => setTimeout(r, 1500));
  await pg.screenshot({ path: `shots/karat-sec-${id}.jpg` });
}
await b.close();
