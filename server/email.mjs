/* Дублирование заявок на почту через SMTP (nodemailer).
   Настраивается env-переменными — без SMTP_* письма просто
   пропускаются, заявка при этом всё равно уходит в Telegram. */
import nodemailer from "nodemailer";

let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 465,
    secure: Number(SMTP_PORT || 465) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

export async function sendEmail(subject, text) {
  const t = getTransporter();
  const to = process.env.MAIL_TO;
  if (!t || !to) {
    console.warn("[mail] SMTP не настроен — письмо пропущено");
    return;
  }
  try {
    await t.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
    });
    console.log("[mail] sent:", subject);
  } catch (e) {
    console.error("[mail] send failed:", e.message);
  }
}
