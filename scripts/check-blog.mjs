/* SEO/render audit of the «Сколько стоит сайт» article.
   Run: node scripts/check-blog.mjs (dev server must be up on :5310) */
import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--no-proxy-server"],
});
const page = await browser.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

const URL = "http://localhost:5310/#/blog/skolko-stoit-sayt";
await page.setViewport({ width: 1440, height: 900 });
await page.goto(URL, { waitUntil: "networkidle0", timeout: 30000 });
await new Promise((r) => setTimeout(r, 2000));
await page.screenshot({ path: "shots/blog-top.png" });

const audit = await page.evaluate(() => {
  const txt = (s) => document.querySelector(s)?.textContent?.trim() ?? null;
  const lds = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
    try { return JSON.parse(s.textContent)["@type"]; } catch { return "PARSE_ERR"; }
  });
  return {
    title: document.title, h1: txt("h1"),
    h2: document.querySelectorAll("h2.post-h2").length,
    desc: document.querySelector('meta[name="description"]')?.content,
    ogType: document.querySelector('meta[property="og:type"]')?.content,
    lds,
    tableRows: document.querySelectorAll(".post-table tbody tr").length,
    faq: document.querySelectorAll(".post-faq__item").length,
    toc: document.querySelectorAll(".post-toc a").length,
    ladderIn: document.querySelector(".price-ladder")?.classList.contains("is-in"),
  };
});
console.log(JSON.stringify(audit, null, 2));
console.log("ERRORS:", errors.length ? errors : "none");

for (const [name, sel] of [["ladder", ".price-ladder"], ["hcosts", ".hcosts"], ["quiz", ".quiz"], ["cta", ".post-cta:last-of-type"]]) {
  await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: "center" }), sel);
  await new Promise((r) => setTimeout(r, 1800));
  const el = await page.$(sel);
  if (el) await el.screenshot({ path: `shots/blog-${name}.png` });
}

await page.setViewport({ width: 390, height: 844 });
await page.goto(URL, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 1500));
await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: "center" }), ".price-ladder");
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: "shots/blog-mobile-ladder.png" });
await browser.close();
console.log("done");
