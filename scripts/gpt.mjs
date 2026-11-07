// GPT consultant via llm-router OpenAI-compatible API (streaming).
// Usage: node scripts/gpt.mjs <prompt-file> [img1.png img2.png ...]
// Response is appended to scripts/gpt-log.md
import { readFileSync, appendFileSync, existsSync } from "node:fs";

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
  content.push({
    type: "image_url",
    image_url: { url: `data:image/png;base64,${readFileSync(p).toString("base64")}` },
  });
}

const res = await fetch(URL_, {
  method: "POST",
  headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    model: MODEL,
    max_tokens: 32768,
    stream: true,
    messages: [{ role: "user", content }],
  }),
  signal: AbortSignal.timeout(600_000),
});

if (!res.ok || !res.body) {
  console.error("HTTP", res.status, await res.text());
  process.exit(1);
}

const reader = res.body.getReader();
const dec = new TextDecoder();
let buf = "";
let text = "";
let usage = "";

for (;;) {
  const { done, value } = await reader.read();
  if (done) break;
  buf += dec.decode(value, { stream: true });
  let idx;
  while ((idx = buf.indexOf("\n\n")) !== -1) {
    const chunk = buf.slice(0, idx);
    buf = buf.slice(idx + 2);
    for (const line of chunk.split("\n")) {
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
}

appendFileSync(
  "scripts/gpt-log.md",
  `\n\n---\n## ${new Date().toISOString()} — ${MODEL} — ${promptFile}\n\n${text}\n\n_usage: ${usage}_\n`,
);
console.log("\n\n[logged to scripts/gpt-log.md]");
