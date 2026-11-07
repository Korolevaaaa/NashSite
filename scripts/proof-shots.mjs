import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--hide-scrollbars"],
});
// contacts — fresh build
let page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:5310/#contacts", { waitUntil: "networkidle0", timeout: 45000 });
await new Promise(r => setTimeout(r, 2500));
await page.screenshot({ path: "shots/rd9-contacts.png" });
await page.close();

// holo closeup — crop of panel edge at 100%
page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:5310/?scrub=0.9", { waitUntil: "networkidle0", timeout: 45000 });
await new Promise(r => setTimeout(r, 4500));
await page.screenshot({ path: "shots/rd9-holo-crop.png", clip: { x: 240, y: 270, width: 400, height: 360 } });
await page.close();

// mobile storefront
page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await page.goto("http://localhost:5310/#templates", { waitUntil: "networkidle0", timeout: 45000 });
await new Promise(r => setTimeout(r, 2500));
await page.screenshot({ path: "shots/rd9-templates-m.png" });
await page.close();
await browser.close();
console.log("done");
