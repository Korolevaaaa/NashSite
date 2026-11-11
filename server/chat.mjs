/* POST /api/chat — AI-ассистент сайта на GigaChat.
   Портировано из старого проекта «Наш сайт»: тот же LEAD-протокол
   ([LEAD]{...}[/LEAD] в конце ответа), но лид теперь сохраняется в
   JSON-стор, уходит в TG-группу И на почту. */
import crypto from "node:crypto";
import { addLead } from "./store.mjs";
import { sendTelegram } from "./telegram.mjs";
import { sendEmail } from "./email.mjs";
import { SERVICES_TEXT, CASES_TEXT } from "./context.mjs";

// GigaChat отдаёт сертификат, который Node не верифицирует без НУЦ Минцифры.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let cachedToken = null;
let tokenExpiresAt = 0;

async function getToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt - 60000) return cachedToken;
  const key = process.env.GIGACHAT_AUTH_KEY;
  if (!key) throw new Error("GIGACHAT_AUTH_KEY не задан");

  const resp = await fetch(
    "https://ngw.devices.sberbank.ru:9443/api/v2/oauth",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${key}`,
        RqUID: crypto.randomUUID(),
      },
      body: "scope=GIGACHAT_API_PERS",
    },
  );
  if (!resp.ok) throw new Error(`GigaChat auth: ${resp.status}`);
  const data = await resp.json();
  cachedToken = data.access_token;
  tokenExpiresAt = data.expires_at;
  return cachedToken;
}

function systemPrompt() {
  return `Ты — дружелюбный AI-ассистент студии ZETRONIX. Студия делает сайты, ботов и цифровые продукты для бизнеса.

Твоя задача — пообщаться с клиентом и СОБРАТЬ ЗАЯВКУ для менеджера.

Сценарий:
1. На первое сообщение — ответь на вопрос (используй данные о студии ниже)
2. Дальше — спроси, как зовут клиента, и его контакт: телефон обязателен, Telegram/WhatsApp — если удобнее
3. Когда есть имя и контакт — попрощайся и скажи, что менеджер свяжется в течение рабочего дня
4. Если клиент не дал имя/контакт — попроси ещё раз, объясни, что это нужно для связи

LEAD-БЛОК — САМОЕ ВАЖНОЕ ПРАВИЛО:
Добавляй [LEAD]{"name":"Имя","contact":"Контакт","task":"Описание"}[/LEAD] в КОНЕЦ ответа ТОЛЬКО когда клиент НАЗВАЛ реальные имя И контакт. Никогда — с пустыми полями. LEAD-блок невидим для клиента.

В поле task — что нужно клиенту + удобный способ связи, если назвал.

Информация о студии:
Услуги и цены:
${SERVICES_TEXT}

Кейсы:
${CASES_TEXT}
Подробно: zetronix.ru/cases и zetronix.ru/templates

Правила:
- Кратко, дружелюбно, на русском
- Не более 4 предложений в ответе
- Не выдумывай цены и сроки — если не знаешь, скажи, что менеджер уточнит`;
}

const sessions = new Map(); // sid → { messages, leadCreated }

function extractLead(reply) {
  const m = reply.match(/\[LEAD\](\{[\s\S]*?\})(?:\[\/LEAD\]|$)/);
  if (!m) return null;
  try {
    const d = JSON.parse(m[1]);
    const name = (d.name || "").trim();
    const contact = (d.contact || "").trim();
    if (name.length > 1 && contact.length > 2 && name !== "Имя") {
      return { name, contact, task: (d.task || "").trim() };
    }
  } catch {
    /* битый JSON в LEAD — просто не создаём заявку */
  }
  return null;
}

async function callGigaChat(messages) {
  const token = await getToken();
  const resp = await fetch(
    "https://gigachat.devices.sberbank.ru/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: "GigaChat",
        messages,
        temperature: 0.7,
        max_tokens: 300,
      }),
    },
  );
  if (!resp.ok) throw new Error(`GigaChat API: ${resp.status}`);
  const data = await resp.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function handleChat(req, res) {
  const message = String(req.body?.message || "").trim();
  let sid = String(req.body?.sessionId || "");
  if (!message) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Сообщение обязательно" }));
    return;
  }
  if (!sid) sid = crypto.randomUUID();

  let s = sessions.get(sid);
  if (!s) {
    s = { messages: [], leadCreated: false };
    sessions.set(sid, s);
  }
  s.messages.push({ role: "user", content: message });

  try {
    const reply = await callGigaChat([
      { role: "system", content: systemPrompt() },
      ...s.messages.slice(-10),
    ]);
    s.messages.push({ role: "assistant", content: reply });

    let leadCreated = false;
    const lead = extractLead(reply);
    if (lead && !s.leadCreated) {
      const userTexts = s.messages
        .filter((m) => m.role === "user")
        .map((m) => m.content);
      const task = lead.task || userTexts.join(" ").slice(0, 300);

      const row = addLead({
        name: lead.name,
        phone: lead.contact,
        social: "",
        comment: `🤖 Через AI-бота: ${task}`,
        source: "chatbot",
        sourceName: "AI-бот",
        page: "",
      });
      s.leadCreated = true;
      leadCreated = true;

      const tgText =
        `🤖 Заявка от AI-бота #${row.id}\n` +
        `👤 Имя: ${lead.name}\n` +
        `📞 Контакт: ${lead.contact}\n` +
        `💬 ${task}`;
      const mailText =
        `Заявка #${row.id} от AI-бота\n\nИмя: ${lead.name}\n` +
        `Контакт: ${lead.contact}\nЗадача: ${task}\nДата: ${row.createdAt}`;
      Promise.allSettled([
        sendTelegram(tgText),
        sendEmail(`Бот-заявка #${row.id} — ${lead.name}`, mailText),
      ]);
    }

    const clean = reply.replace(/\[LEAD\][\s\S]*?(\[\/LEAD\]|$)/, "").trim();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ reply: clean, sessionId: sid, leadCreated }));
  } catch (e) {
    console.error("[chat]", e.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Не удалось получить ответ. Попробуйте позже.",
        sessionId: sid,
      }),
    );
  }
}
