// Compose case cover cards (4:5) from real screenshots:
// light #f4f4f4 canvas + faint blueprint grid + browser-framed site shot.
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = fileURLToPath(new URL("../public/cases/instabarter/", import.meta.url));
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const W = 1200, H = 1500; // 4:5

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-proxy-server", "--hide-scrollbars", "--force-device-scale-factor=1"],
});

const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });

import { readFileSync } from "node:fs";
const img = "data:image/png;base64," + readFileSync(ROOT + "hero.png").toString("base64");

const html = `<!doctype html><style>
  * { margin: 0; box-sizing: border-box; }
  body {
    width: ${W}px; height: ${H}px; overflow: hidden;
    background: #f4f4f4;
    font-family: system-ui;
    display: grid; place-items: center;
    position: relative;
  }
  /* faint blueprint grid */
  .grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(13,17,23,.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(13,17,23,.045) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(120% 90% at 50% 45%, #000 40%, transparent 78%);
  }
  .frame {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(#00c9d4, #00c9d4),
      linear-gradient(#00c9d4, #00c9d4),
      linear-gradient(#00c9d4, #00c9d4),
      linear-gradient(#00c9d4, #00c9d4);
    background-size: 90px 1px, 1px 90px, 90px 1px, 1px 90px;
    background-position: left 46px top 46px, left 46px top 46px,
                       right 46px bottom 46px, right 46px bottom 46px;
    background-repeat: no-repeat;
    opacity: .55;
  }
  .tag {
    position: absolute; top: 64px; left: 64px;
    font: 600 15px/1 system-ui; letter-spacing: .18em; color: #4e5b60;
  }
  .tag b { color: #006b70; font-weight: 700; }
  .tag2 {
    position: absolute; bottom: 64px; right: 64px;
    font: 600 15px/1 system-ui; letter-spacing: .18em; color: #006b70;
  }
  .win {
    position: relative; z-index: 2;
    width: 1000px;
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 40px 80px rgba(13,17,23,.18), 0 2px 6px rgba(13,17,23,.08);
    overflow: hidden;
  }
  .chrome {
    display: flex; align-items: center; gap: 8px;
    padding: 16px 20px; background: #fbfbfb;
    border-bottom: 1px solid rgba(13,17,23,.08);
  }
  .chrome i { width: 12px; height: 12px; border-radius: 50%; background: rgba(13,17,23,.14); }
  .chrome span {
    margin-left: 14px; flex: 1; height: 26px;
    border-radius: 999px; background: rgba(13,17,23,.05);
    font: 500 13px/26px system-ui; color: #4e5b60; padding: 0 16px;
  }
  .shot { display: block; width: 100%; height: 640px; object-fit: cover; object-position: 50% 12%; }
</style>
<div class="grid"></div>
<div class="frame"></div>
<div class="tag">CASE <b>/ 01</b></div>
<div class="tag2">graffiti-zerkalo.ru</div>
<div class="win">
  <div class="chrome"><i></i><i></i><i></i><span>graffiti-zerkalo.ru</span></div>
  <img class="shot" src="${img}" />
</div>`;

await page.setContent(html);
await page.waitForSelector("img");
await new Promise((r) => setTimeout(r, 600));
await page.screenshot({ path: ROOT + "cover.png" });
console.log("saved cover.png", W + "x" + H);
await browser.close();
