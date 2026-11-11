/* API-сервер сайта: /api/leads + /api/chat + раздача dist/ в проде.
   Запуск: node server/index.mjs (или `npm run server`).
   Секреты — в server/.env (см. server/.env.example). */
import "./env.mjs";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handleCreateLead, handleListLeads } from "./leads.mjs";
import { handleChat } from "./chat.mjs";

const PORT = Number(process.env.PORT) || 3100;
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, "..", "dist");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => {
      data += c;
      if (data.length > 1e6) req.destroy(); // 1 MB cap
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error("bad json"));
      }
    });
    req.on("error", reject);
  });
}

/* Грубый rate-limit по IP: 30 запросов/мин на /api. */
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const rec = hits.get(ip) || { n: 0, t: now };
  if (now - rec.t > 60_000) {
    rec.n = 0;
    rec.t = now;
  }
  rec.n++;
  hits.set(ip, rec);
  return rec.n > 30;
}

function serveStatic(req, res, url) {
  let p = decodeURIComponent(url.pathname);
  if (p.includes("..")) {
    res.writeHead(403);
    res.end();
    return;
  }
  let file = path.join(DIST, p);
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    const idx = path.join(file, "index.html");
    if (fs.existsSync(idx)) file = idx;
    else file = path.join(DIST, "index.html"); // SPA/prerender fallback
  }
  if (!fs.existsSync(file)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, {
    "Content-Type": MIME[ext] || "application/octet-stream",
    "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
  });
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "";

  if (url.pathname.startsWith("/api/")) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }
    if (rateLimited(ip)) {
      res.writeHead(429, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Слишком много запросов" }));
      return;
    }
    try {
      if (url.pathname === "/api/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } else if (url.pathname === "/api/leads" && req.method === "POST") {
        req.body = await readBody(req);
        await handleCreateLead(req, res);
      } else if (url.pathname === "/api/leads" && req.method === "GET") {
        handleListLeads(req, res);
      } else if (url.pathname === "/api/chat" && req.method === "POST") {
        req.body = await readBody(req);
        await handleChat(req, res);
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not found" }));
      }
    } catch (e) {
      console.error("[api]", e);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal error" }));
    }
    return;
  }

  if (fs.existsSync(DIST)) serveStatic(req, res, url);
  else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("API up. Static dist not built yet.");
  }
});

server.listen(PORT, () => {
  console.log(`ZETRONIX API on http://localhost:${PORT}`);
});
