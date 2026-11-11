/* Уведомления в Telegram-группу студии.
   Токен/чат/прокси берутся из env (server/.env), прокси нужен если
   сервер стоит в РФ и api.telegram.org недоступен напрямую. */
import https from "node:https";

let tgAgent = null;
async function getAgent() {
  if (tgAgent !== null) return tgAgent;
  const proxy = process.env.TG_PROXY || "";
  if (proxy) {
    const { HttpsProxyAgent } = await import("https-proxy-agent");
    tgAgent = new HttpsProxyAgent(proxy);
  } else {
    tgAgent = undefined;
  }
  return tgAgent;
}

export async function sendTelegram(text) {
  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;
  if (!token || !chatId) {
    console.warn("[tg] TG_BOT_TOKEN/TG_CHAT_ID не заданы — уведомление пропущено");
    return;
  }

  const payload = JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" });
  const agent = await getAgent();

  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: "api.telegram.org",
        path: `/bot${token}/sendMessage`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
        agent,
      },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          if (!(res.statusCode >= 200 && res.statusCode < 300)) {
            console.error("[tg] API error", res.statusCode, body);
          }
          resolve();
        });
      },
    );
    req.on("error", async (e) => {
      console.error("[tg] send failed:", e.message);
      // прокси умер — пробуем напрямую
      if (agent) {
        tgAgent = undefined;
        resolve(sendTelegram(text));
        return;
      }
      resolve();
    });
    req.write(payload);
    req.end();
  });
}
