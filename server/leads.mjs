/* POST /api/leads — публичный приём заявок с сайта.
   Заявка сохраняется в JSON-стор, уходит в TG-группу и на почту. */
import { addLead } from "./store.mjs";
import { sendTelegram } from "./telegram.mjs";
import { sendEmail } from "./email.mjs";

export async function handleCreateLead(req, res) {
  const b = req.body || {};
  const name = String(b.name || "").trim();
  const phone = String(b.phone || "").trim();
  const social = String(b.social || "").trim();
  const comment = String(b.comment || "").trim();
  const source = String(b.source || "organic").trim();
  const sourceName = String(b.sourceName || "").trim();
  const page = String(b.page || "").trim();

  if (!name || !phone) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Имя и телефон обязательны" }));
    return;
  }

  const lead = addLead({ name, phone, social, comment, source, sourceName, page });

  const socialLine = social ? `\n💬 Соцсеть: ${social}` : "";
  const commentLine = comment ? `\n📝 ${comment}` : "";
  const srcLine = sourceName ? `\n📍 Источник: ${sourceName} (${source})` : "";
  const pageLine = page ? `\n🔗 Страница: ${page}` : "";

  const tgText =
    `🆕 Заявка с сайта #${lead.id}\n` +
    `👤 Имя: ${name}\n` +
    `📞 Телефон: ${phone}` +
    socialLine + commentLine + srcLine + pageLine;

  const mailText =
    `Заявка #${lead.id} с сайта zetronix.ru\n\n` +
    `Имя: ${name}\nТелефон: ${phone}\n` +
    (social ? `Соцсеть: ${social}\n` : "") +
    (comment ? `Комментарий: ${comment}\n` : "") +
    (sourceName ? `Источник: ${sourceName} (${source})\n` : "") +
    (page ? `Страница: ${page}\n` : "") +
    `Дата: ${lead.createdAt}`;

  await Promise.allSettled([
    sendTelegram(tgText),
    sendEmail(`Заявка #${lead.id} — ${name}`, mailText),
  ]);

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true, id: lead.id }));
}

export function handleListLeads(_req, res) {
  // Заглушка до появления авторизованной админки — список наружу не отдаём.
  res.writeHead(403, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Forbidden" }));
}
