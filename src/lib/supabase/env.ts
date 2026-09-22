/**
 * Supabase 접속 정보를 한 곳에서 읽고, 없으면 원인을 분명히 알려줍니다.
 *
 * `process.env.X!` 처럼 non-null 단언만 붙이면 타입 검사만 통과하고
 * 런타임에는 undefined가 그대로 흘러가 "URL and Key are required" 같은
 * 원인을 알기 어려운 메시지로 끝납니다. 빌드/배포 로그에서 바로
 * 무엇을 해야 하는지 보이도록 여기서 먼저 막습니다.
 */

const HINT =
  "로컬은 .env.local, Vercel은 Project Settings → Environment Variables 에 " +
  "Production / Preview / Development 세 환경 모두 등록한 뒤 다시 배포해 주세요. " +
  "값은 Supabase 대시보드 → Project Settings → Data API 에서 확인할 수 있습니다.";

function required(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`환경변수 ${name} 이(가) 설정되지 않았습니다.\n${HINT}`);
  }
  return value;
}

export function supabaseUrl() {
  return required(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
}

export function supabaseAnonKey() {
  return required(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
