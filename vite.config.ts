import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // API-сервер (server/index.mjs) — заявки в Telegram/почту и AI-чат
    proxy: { "/api": "http://localhost:3100" },
  },
});
