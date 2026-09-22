import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/** Next 16의 proxy 컨벤션 — 매 요청마다 Supabase 세션 토큰을 갱신합니다. */
export default async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * 정적 파일과 이미지 최적화 경로를 제외한 모든 요청에서 세션을 갱신합니다.
     */
    "/((?!_next/static|_next/image|favicon.ico|illustrations|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
