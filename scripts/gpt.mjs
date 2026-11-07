// GPT consultant via llm-router OpenAI-compatible API (streaming over node:https —
// raw socket, no undici header timeout: the router can think for minutes).
// Usage: node scripts/gpt.mjs <prompt-file> [img1.png img2.png ...]
// Response is appended to scripts/gpt-log.md
import { readFileSync, appendFileSync, existsSync } from "node:fs";
import https from "node:https";

const KEY = process.env.LLMR_KEY;
if (!KEY) {
  console.error("LLMR_KEY env var is required");
  process.exit(1);
}
const URL_ = "https://llm-router.org/v1/chat/completions";
const MODEL = process.env.GPT_MODEL ?? "gpt-6-astra";

const args = process.argv.slice(2);
const promptFile = args[0];
const imgs = args.slice(1);

const prompt = readFileSync(promptFile, "utf8");
const content = [{ type: "text", text: prompt }];
for (const p of imgs) {
  if (!existsSync(p)) {
    console.error("missing img:", p);
    continue;
  }
  const mime = p.endsWith(".jpg") || p.endsWith(".jpeg") ? "image/jpeg" : "image/png";
  content.push({
    type: "image_url",
    image_url: { url: `data:${mime};base64,${readFileSync(p).toString("base64")}` },
  });
}

const body = JSON.stringify({
  model: MODEL,
  max_tokens: 32768,
  stream: true,
  messages: [{ role: "user", content }],
});

const req = https.request(
  URL_,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
    },
    timeout: 0, // never time out the socket ourselves
  },
  (res) => {
    if (res.statusCode !== 200) {
      let err = "";
      res.on("data", (c) => (err += c));
      res.on("end", () => {
        console.error("HTTP", res.statusCode, err.slice(0, 2000));
        process.exit(1);
      });
      return;
    }
    res.setEncoding("utf8");
    let buf = "";
    let text = "";
    let usage = "";
    res.on("data", (chunk) => {
      buf += chunk;
      let idx;
      while ((idx = buf.indexOf("\n\n")) !== -1) {
        const piece = buf.slice(0, idx);
        buf = buf.slice(idx + 2);
        for (const line of piece.split("\n")) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const j = JSON.parse(data);
            const delta = j?.choices?.[0]?.delta?.content ?? j?.choices?.[0]?.message?.content ?? "";
            if (delta) {
              text += delta;
              process.stdout.write(delta);
            }
            if (j?.usage) usage = JSON.stringify(j.usage);
          } catch { /* partial json */ }
        }
      }
    });
    res.on("end", () => {
      appendFileSync(
        "scripts/gpt-log.md",
        `\n\n---\n## ${new Date().toISOString()} — ${MODEL} — ${promptFile}\n\n${text}\n\n_usage: ${usage}_\n`,
      );
      console.log("\n\n[logged to scripts/gpt-log.md]");
    });
  },
);
req.on("error", (e) => {
  console.error("REQ ERR", e.message);
  process.exit(1);
});
req.write(body);
req.end();
