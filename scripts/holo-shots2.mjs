import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--hide-scrollbars"],
});
for (const [name, scrub] of [["b075", "0.75"], ["n090", "0.9"]]) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:5310/?scrub=${scrub}`, { waitUntil: "networkidle0", timeout: 45000 });
  await new Promise((r) => setTimeout(r, 4500));
  await page.screenshot({ path: `shots/rd9-holo-${name}.png` });
  console.log("shot", name);
  await page.close();
}
// diplomas open — full section in frame
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:5310/", { waitUntil: "networkidle0", timeout: 45000 });
await new Promise((r) => setTimeout(r, 2000));
await page.evaluate(() => document.querySelector(".comp-toggle")?.click());
await new Promise((r) => setTimeout(r, 1000));
await page.evaluate(() => document.getElementById("competencies")?.scrollIntoView({ block: "start" }));
await page.evaluate(() => window.scrollBy(0, -70));
await new Promise((r) => setTimeout(r, 800));
await page.screenshot({ path: "shots/rd9-diplomas.png" });
console.log("shot diplomas");
await browser.close();
