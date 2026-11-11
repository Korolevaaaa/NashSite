/* Деплой на zetronix.ru: сборка → ветка release (dist + server) → push на сервер.
   Сервер: post-receive хук раскладывает файлы в /var/www/zetronix и перезапускает API.
   Запуск: `npm run deploy`. Ключ SSH: ~/.ssh/zetronix_deploy (переопределяется DEPLOY_KEY). */
import { execFileSync, execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const REMOTE = "deploy";
const REMOTE_URL = "ssh://root@155.212.160.35/srv/zetronix-release.git";
const BRANCH = "release";
const KEY = process.env.DEPLOY_KEY || path.join(os.homedir(), ".ssh", "zetronix_deploy");

const run = (cmd, args, env = {}) =>
  execFileSync(cmd, args, { stdio: "inherit", env: { ...process.env, ...env } });
const out = (args) =>
  execFileSync("git", args, { encoding: "utf8" }).trim();

if (!fs.existsSync(KEY)) {
  console.error(`SSH-ключ не найден: ${KEY}`);
  process.exit(1);
}

const remotes = out(["remote"]).split("\n");
if (!remotes.includes(REMOTE)) run("git", ["remote", "add", REMOTE, REMOTE_URL]);
else execFileSync("git", ["remote", "set-url", REMOTE, REMOTE_URL]);

console.log("==> npm run build");
execSync("npm run build", { stdio: "inherit" });

// Коммитим dist + server + package.json в ветку release через отдельный index —
// рабочее дерево и текущая ветка не трогаются.
const tmpIndex = path.join(os.tmpdir(), `zetronix-idx-${Date.now()}`);
const env = { GIT_INDEX_FILE: tmpIndex };
const g = (args) =>
  execFileSync("git", args, { encoding: "utf8", env: { ...process.env, ...env } }).trim();

let parent = [];
try {
  parent = ["-p", out(["rev-parse", `refs/heads/${BRANCH}`])];
} catch { /* первый релиз — без родителя */ }

g(["read-tree", "--empty"]);
g(["add", "-f", "dist"]);
g(["add", "server", "package.json", "package-lock.json"]);
const tree = g(["write-tree"]);
const commit = g([
  "commit-tree", tree, ...parent,
  "-m", `release ${new Date().toISOString().slice(0, 16).replace("T", " ")}`,
]);
fs.rmSync(tmpIndex, { force: true });
execFileSync("git", ["update-ref", `refs/heads/${BRANCH}`, commit]);

console.log("==> push на сервер");
run("git", ["push", "-f", REMOTE, `${BRANCH}:${BRANCH}`], {
  GIT_SSH_COMMAND: `ssh -i "${KEY}" -o StrictHostKeyChecking=accept-new`,
});
console.log("==> Готово: https://zetronix.ru");
