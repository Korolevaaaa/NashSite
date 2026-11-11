/* JSON-стор заявок: server/data/leads.json. Намеренно простой —
   объёмы заявок сайта студии небольшие, а полноценная БД
   появится вместе с Supabase-админкой. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "data");
const FILE = path.join(dir, "leads.json");

function read() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return [];
  }
}

function write(leads) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(leads, null, 2));
}

export function addLead(lead) {
  const leads = read();
  const id = leads.length ? Math.max(...leads.map((l) => l.id)) + 1 : 1;
  const row = {
    id,
    createdAt: new Date().toISOString(),
    status: "new",
    ...lead,
  };
  leads.push(row);
  write(leads);
  return row;
}

export function listLeads() {
  return read().sort((a, b) => b.id - a.id);
}
