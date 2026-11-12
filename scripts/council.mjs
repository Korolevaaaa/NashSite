/* Совет моделей (council): общий чат Devin + внешние LLM через coarena.ai.
   История хранится в council/session.json — переживает смену ключа/аккаунта:
   новый ключ → `node scripts/council.mjs key <новый>` → `... resume`.

   Команды:
     node scripts/council.mjs start            — создать сессию и послать seed обеим
     node scripts/council.mjs round            — каждая модель отвечает на весь чат
     node scripts/council.mjs me "<текст>"     — добавить реплику Devin'а (без API)
     node scripts/council.mjs post <alias> "t" — реплика Devin'а + ответ одной модели
     node scripts/council.mjs resume           — после смены ключа: продолжить чат
     node scripts/council.mjs status           — показать транскрипт вкратце
   Ключ: council/config.json или env COARENA_KEY. */

import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "council");
const SESSION = path.join(DIR, "session.json");
const CONFIG = path.join(DIR, "config.json");
const CONTEXT = path.join(DIR, "context.md");
const API = "https://coarena.ai/api/v1/chat/completions";

const MODELS = {
  // id в API → роль в споре. gpt-6-1-terra сейчас выключена (model_off) —
  // вернуть одной строкой, когда включат.
  explorer: { id: "kimi-k3-1-pro", name: "Kimi K3.1 Pro (Explorer)" },
  adversary: { id: "claude-opus-5-5", name: "Opus 5.5 (Adversary)" },
};

const load = (p, fb) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : fb);
const save = (p, d) => fs.writeFileSync(p, JSON.stringify(d, null, 2), "utf8");

const cfg = load(CONFIG, { key: process.env.COARENA_KEY || "" });
if (process.env.COARENA_KEY) cfg.key = process.env.COARENA_KEY;

const session = load(SESSION, { messages: [] });

const ROLE = {
  explorer: `Ты — Explorer в трёхстороннем совете по улучшению сайта ZETRONIX (участники: Opus 5.5 — Adversary, Devin — Referee и единственный, кто правит код).
ТВОЯ РОЛЬ: находить проблемы, риски и возможности. Очки за каждую находку: +1 мелкая, +5 средняя, +10 критическая. Хочешь максимум — копай глубоко.
ПРАВИЛА: никакой вежливости и поддакивания. Слабая идея — говори прямо. Каждая находка — с привязкой к файлу/строке кода. НЕ пиши финальный код — давай ПОДСКАЗКИ: что менять, где (файл, функция, строки) и почему, с фрагментами кода-иллюстраций. Devin применит.
ФОРМАТ: ### Finding N: название / Impact: Critical|Medium|Low / Evidence: файл:строка / Fix hint: что делать.`,
  adversary: `Ты — Adversary в трёхстороннем совете по улучшению сайта ZETRONIX (участники: Kimi — Explorer, Devin — Referee и единственный, кто правит код).
ТВОЯ РОЛЬ: опровергать. За верно опровергнутую находку Explorer получаешь её очки; за ошибочное опровержение — минус двойные. Атакуй только то, что реально неверно, но ложь не пропускай.
ПРАВИЛА: проверяй каждую находку по коду из контекста — галлюцинации файлов/строк = твой автоматический успех. Валидное подтверждай честно. Когда опровержение открывает лучший путь — давай свой Fix hint (файл:строки + фрагмент). Никакой вежливости.`,
};

function transcriptMessages(forAlias) {
  const msgs = [];
  if (fs.existsSync(CONTEXT))
    msgs.push({ role: "user", content: fs.readFileSync(CONTEXT, "utf8") });
  for (const m of session.messages) {
    const who = m.from === forAlias ? "assistant" : "user";
    const prefix =
      m.from === "devin" ? "[Devin — referee, пишет код]:\n"
      : m.from === forAlias ? ""
      : `[${MODELS[m.from]?.name || m.from}]:\n`;
    msgs.push({ role: who, content: prefix + m.text });
  }
  return msgs;
}

async function call(alias) {
  const model = MODELS[alias];
  const body = {
    model: model.id,
    max_tokens: 16000,
    messages: [
      { role: "system", content: ROLE[alias] + "\n\nОтвечай по-русски, плотно, без воды. Формат markdown." },
      ...transcriptMessages(alias),
    ],
  };
  const r = await fetch(API, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`${model.name}: ${JSON.stringify(j.error || j)}`);
  const ch = j.choices?.[0];
  let text = ch?.message?.content ?? "";
  const reasoning = ch?.message?.reasoning_content || ch?.message?.reasoning || "";
  if (!text && reasoning) text = `[reasoning]\n${reasoning}`;
  if (ch?.finish_reason === "length")
    console.error(`!! ${model.name}: finish_reason=length — ответ обрезан`);
  if (j.usage) session.usage = { ...(session.usage || {}), [model.id]: { ...(session.usage?.[model.id] || {}), last: j.usage } };
  session.messages.push({ from: alias, ts: Date.now(), text });
  save(SESSION, session);
  console.log(`\n===== ${model.name} =====\n${text}\n`);
}

const [, , cmd, ...rest] = process.argv;

if (cmd === "key") {
  cfg.key = rest[0];
  fs.mkdirSync(DIR, { recursive: true });
  save(CONFIG, cfg);
  console.log("key saved");
  process.exit(0);
}
if (!cfg.key) { console.error("нет ключа: council/config.json или COARENA_KEY"); process.exit(1); }

if (cmd === "start") {
  fs.mkdirSync(DIR, { recursive: true });
  const seed = rest.join(" ") || fs.readFileSync(path.join(DIR, "brief.md"), "utf8");
  session.messages = [{ from: "devin", ts: Date.now(), text: seed }];
  session.started = Date.now();
  save(SESSION, session);
  await call("explorer");
  await call("adversary");
} else if (cmd === "round") {
  for (const a of rest.length ? rest : ["explorer", "adversary"]) await call(a);
} else if (cmd === "post") {
  const alias = rest[0];
  const msg = rest.slice(1).join(" ");
  if (msg) { session.messages.push({ from: "devin", ts: Date.now(), text: msg }); save(SESSION, session); }
  await call(alias);
} else if (cmd === "me") {
  session.messages.push({ from: "devin", ts: Date.now(), text: rest.join(" ") });
  save(SESSION, session);
  console.log("ok");
} else if (cmd === "resume") {
  session.messages.push({
    from: "devin", ts: Date.now(),
    text: "[смена API-ключа] Совет возобновляется. Выше — весь контекст и наш диалог. Продолжаем с места остановки, вернитесь к своим ролям.",
  });
  save(SESSION, session);
  await call("explorer");
  await call("adversary");
} else if (cmd === "status") {
  for (const m of session.messages)
    console.log(`\n--- ${m.from} @ ${new Date(m.ts).toLocaleTimeString()} (${m.text.length} зн.) ---\n${m.text.slice(0, 600)}`);
} else {
  console.log("commands: start | round [alias..] | post <alias> <msg> | me <msg> | resume | status | key <k>");
}
