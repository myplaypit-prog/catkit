<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# 무병장수 — 프로젝트 규칙

고양이 처방식·건강기능식품 스토어. Next.js 16 App Router · Tailwind v4 · Supabase · 토스페이먼츠 v2.
**학습·시연용 데모**이며 실제 결제·배송은 없습니다.

작업을 시작하기 전에 `HANDOFF.md`를 먼저 읽어주세요.

## 브랜드

- 이름은 **무병장수**입니다. `캣킷` / `CATKIT`은 2026-09 리네이밍으로 전부 걷어냈습니다. 되살리지 마세요.
- 이름에 '고양이'가 없으므로 로고는 항상 `무병장수` + `고양이 처방식 · 건강식` 디스크립터를
  한 묶음으로 씁니다 (`components/Header.tsx` · `Footer.tsx` 참고).
- 워드마크는 Pretendard ExtraBold(고딕)입니다. `.brand-display`(명조)는 h1 같은 헤드라인 전용이며
  로고에는 쓰지 않습니다 — 명조로 쓰면 한약방 톤이 됩니다.
- 로고 에셋은 `public/brand/logo.svg`(가로형) · `mark.svg`(심볼). 헤더·푸터에서는
  인라인 컴포넌트 `CatMark`(`components/icons/CatArt.tsx`)를 씁니다.
- 남아 있는 `catkit` 문자열 3곳은 의도된 것입니다. 전부 화면에 보이지 않습니다.
  - `public/illustrations/catkit-hero.png` 파일명
  - `app/api/payments/confirm/route.ts`의 Idempotency-Key 접두어 `"catkit-confirm-"`
  - `components/CartProvider.tsx`의 `STORAGE_KEY = "catkit.cart.v1"` —
    바꾸면 이미 담아둔 방문자의 장바구니가 전부 비워집니다. 그대로 두세요.
- 주문번호 접두어는 **`MBJS-`** 입니다(`lib/format.ts`). 결제완료 · 결제실패 ·
  주문내역 세 화면에 그대로 노출되므로 브랜드를 따라갑니다. 예전 `CATKIT-`은 걷어냈습니다.

## 색 — 대비가 기준입니다

`globals.css`의 토큰만 씁니다. 컴포넌트에 hex를 새로 하드코딩하지 마세요.
모든 텍스트 색은 **크림 배경(`--cream`) 기준 WCAG AA 4.5:1**을 넘겨야 하고,
현재 값들은 그 선에 맞춰 잡아둔 것입니다.

| 토큰 | 값 | 대비 |
|---|---|---|
| `--primary` | `#B9502F` | 흰 글씨 버튼 4.9:1 / 크림 위 텍스트 4.6:1 |
| `--primary-deep` | `#9F432A` | 호버 · 강조 링크 5.9:1 |
| `--ink-soft` | `#5E6157` | 5.9:1 |
| `--ink-faint` | `#6E7065` | 4.7:1 — 이보다 밝게 올리지 마세요 |
| `--hero` | `#F3EBDF` | 히어로 배경. 키비주얼 그라데이션과 같은 값이어야 합니다 |

## 히어로 키비주얼

`components/HeroArt.tsx`. 사진을 액자에 넣지 않고 섹션 배경으로 흘려보내는 구조입니다.

- `HeroBackdrop` (lg+) — 오른쪽 화면 끝까지 풀블리드, 왼쪽을 `--hero` 그라데이션으로 덮어 경계 제거.
- `HeroImageMobile` (< lg) — 카피 아래 전폭 밴드. 높이는 **반드시 `aspect-[3/2]` 비율로** 잡습니다.
  고정 높이로 바꾸면 820px 안팎에서 고양이 머리가 잘립니다.
- 두 컴포넌트의 그라데이션에 쓰는 `HERO_BG` 상수와 CSS의 `--hero`는 항상 같은 값이어야 합니다.

## 데모 데이터는 건드리지 않습니다

`vets` · `clinics` · `testimonials`와 상품 별점·리뷰 수는 예시 데이터이고,
상품 이미지는 제형별 3종(`dry` / `wet` / `supplement`)을 돌려 씁니다.
의도된 상태이니 "별점을 다양하게" 같은 개선은 하지 마세요.

## 상품 그리드

모바일 2열이 기본입니다 — `grid grid-cols-2 gap-3 sm:gap-4 ...`.
`ProductCard`의 타입·여백 스케일은 좁은 칸 기준으로 잡혀 있으니 한 덩어리로 다루세요.
