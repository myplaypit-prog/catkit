#!/usr/bin/env node
/**
 * .env.local 의 값을 Vercel 프로젝트 환경변수로 등록합니다.
 *
 *   npx vercel login      # 최초 1회
 *   npx vercel link       # 프로젝트 연결 (최초 1회)
 *   node scripts/vercel-env.mjs
 *
 * 이미 같은 이름의 환경변수가 있으면 지우고 다시 등록합니다.
 */
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const TARGETS = ["production", "preview", "development"];

const KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_TOSS_CLIENT_KEY",
  "TOSS_SECRET_KEY",
];

function readEnvLocal() {
  const raw = readFileSync(join(root, ".env.local"), "utf8");
  const out = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

function vercel(args, input) {
  return spawnSync("npx", ["--yes", "vercel@latest", ...args], {
    cwd: root,
    input,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
}

const env = readEnvLocal();
let failed = 0;

for (const key of KEYS) {
  const value = env[key];
  if (!value) {
    console.log(`✗ ${key} — .env.local 에 값이 없습니다`);
    failed++;
    continue;
  }

  for (const target of TARGETS) {
    // 기존 값이 있으면 조용히 제거
    vercel(["env", "rm", key, target, "--yes"]);

    const res = vercel(["env", "add", key, target], value + "\n");
    const ok = res.status === 0;
    if (!ok) failed++;
    const shown =
      key === "TOSS_SECRET_KEY" ? value.slice(0, 12) + "…" : value.slice(0, 44);
    console.log(`${ok ? "✓" : "✗"} ${key} [${target}] ${ok ? shown : (res.stderr || "").trim().split("\n").pop()}`);
  }
}

// 배포 주소는 Vercel이 자동으로 채워주는 VERCEL_URL 을 쓰므로 별도 등록하지 않습니다.

if (failed > 0) {
  console.log(`\n${failed}건 실패. 'npx vercel login' 과 'npx vercel link' 를 먼저 실행했는지 확인해 주세요.`);
  process.exit(1);
}

console.log("\n모두 등록됐습니다. 이제 'npx vercel --prod' 또는 git push 로 배포하세요.");
