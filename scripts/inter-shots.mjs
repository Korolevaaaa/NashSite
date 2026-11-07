import puppeteer from "puppeteer-core";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await puppeteer.launch({
  executablePath: CHROME, headless: "new",
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto("http://localhost:5310/", { waitUntil: "networkidle0", timeout: 40000 });
await new Promise(r => setTimeout(r, 2000));

// 1) diplomas open
await page.evaluate(() => {
  document.querySelector(".comp-toggle")?.click();
});
await new Promise(r => setTimeout(r, 900));
await page.evaluate(() => {
  document.getElementById("diplomas")?.scrollIntoView({ block: "center" });
});
await new Promise(r => setTimeout(r, 700));
await page.screenshot({ path: "shots/rd8-diplomas.png" });

// 2) storefront filter + search
await page.evaluate(() => {
  document.getElementById("templates")?.scrollIntoView();
  window.scrollBy(0, -60);
});
await new Promise(r => setTimeout(r, 800));
await page.evaluate(() => {
  const inp = document.querySelector(".sf-search");
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  setter.call(inp, "суши");
  inp.dispatchEvent(new Event("input", { bubbles: true }));
});
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: "shots/rd8-sf-search.png" });

// 3) admin page
await page.goto("http://localhost:5310/#/admin", { waitUntil: "networkidle0" });
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: "shots/rd8-admin.png" });
await browser.close();
console.log("done");
