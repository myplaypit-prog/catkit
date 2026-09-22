# 인계 메모 — 2026-09-22

Cowork 세션에서 `캣킷 → 무병장수` 리네이밍과 디자인 개선을 적용한 뒤 넘깁니다.
프로젝트 규칙은 `AGENTS.md` 아래쪽 「무병장수 — 프로젝트 규칙」을 먼저 읽어주세요.

---

## 이미 끝난 것 — 다시 하지 마세요

| 작업 | 건드린 파일 |
|---|---|
| 브랜드명 교체 (화면 텍스트 11곳 · 주석 3곳) | `layout.tsx` `page.tsx` `login/page.tsx` `Header.tsx` `Footer.tsx` `HeroArt.tsx` `globals.css` `CatArt.tsx` `package.json` `README.md` |
| 로고 재제작 | `public/brand/logo.svg` · `mark.svg` |
| 히어로 키비주얼 풀블리드 재설계 | `components/HeroArt.tsx` · `app/page.tsx` |
| 색 토큰 대비 보정 + 하드코딩 hex 4곳 제거 | `globals.css` `ProductCard.tsx` `ui.tsx` `page.tsx` |
| 모바일 2열 상품 그리드 | `page.tsx` `products/page.tsx` `supplements/page.tsx` `categories/[slug]/page.tsx` `products/[slug]/page.tsx` `ProductCard.tsx` |
| 모바일 헤더 검색 버튼 | `components/Header.tsx` |
| 근거 A/B/C 칩 위계 | `app/page.tsx`의 `EvidenceChip` |
| OG 이미지 1200×630 | `app/opengraph-image.png` · `twitter-image.png` |

**검증 범위** — `npx tsc --noEmit` 통과, `next build` 통과,
390 / 640 / 820 / 1000 / 1440px 스크린샷 확인.
단, Supabase 접근이 막힌 환경이라 **상품 데이터가 비어 있는 상태로만** 봤습니다.

---

## 남은 일 — 2026-09-22 전부 완료 (`cfe95f5`)

### 1. 모바일 상품 카드 실물 확인 ✅ — 버그 1건 발견·수정

390px에서 상품 26개로 확인했습니다. 타입 스케일은 문제없었고, 원인은 따로 있었습니다.

`<Badge className="hidden sm:inline-flex">`로 건 숨김이 **동작하지 않았습니다.**
`Badge`가 내부에 `inline-flex`를 하드코딩하고 뒤에 `className`을 잇는데,
Tailwind v4가 `.inline-flex`를 `.hidden`보다 나중에 출력해 특이도가 같은 상태에서
`inline-flex`가 이겼습니다. 결과적으로 영양제 카드 9장에서 뱃지가 2줄로 넘쳐
(148px 자리에 184~219px) 카드 높이가 흔들렸습니다.

숨김을 래퍼(`<span className="hidden sm:contents">`)로 옮겨 해결했습니다.
**`Badge`에 display 유틸을 className으로 넘기지 마세요. 같은 함정에 빠집니다.**

수정 후 — 26장 전부 뱃지 1줄(55px→25px), 상품명 잘림 0건(최대 2줄),
가격·별점 위계 정상, 카드 높이 편차 37px. 640px에서 3번째 뱃지 정상 복귀.

### 2. 구 로고 파일 삭제 ✅

`catkit-logo.svg` · `catkit-mark.svg` 삭제. 참조 0건 확인했습니다.

### 3. 빌드 후 배포 ✅

`tsc` · `lint` · `build`(33페이지) 통과 후 push → 배포 확인.

### 4. OG 이미지 확인 ✅

`og:*` · `twitter:*` 태그 전부 정상, 이미지 1200×630 HTTP 200 서빙 확인.

---

## 이번에 같이 고친 것 (남은 일 밖)

### 히어로 모바일 밴드가 고정 높이였습니다

`AGENTS.md`는 `aspect-[3/2]`를 요구하는데 코드는 `h-[270px] sm:h-[340px]`였습니다.
원본이 4:3이라 폭이 넓어질수록 세로만 깎여서, 820px에서 세로의 45%가 날아가고
**고양이 귀가 통째로 잘렸습니다.** `aspect-[3/2]`로 되돌려 어느 폭에서든
잘림이 11%로 일정해졌습니다. 390 / 640 / 820 / 1023 / 1280px 확인.

### 주문번호 접두어가 `CATKIT-`으로 남아 있었습니다

결제완료 · 결제실패 · 주문내역 세 화면에 노출되는 값입니다. `MBJS-`로 교체했고,
DB에 주문 0건이라 기존 번호와 충돌하지 않습니다. 자세한 건 `AGENTS.md` 브랜드 절.

---

## 손대지 않기로 합의한 것

- **상품 별점 · 리뷰 수 · 상품 이미지 3종** — 데모 데이터라 그대로 둡니다.
- `catkit-hero.png` 파일명, 결제 Idempotency-Key 접두어 `"catkit-confirm-"`.
- **도메인과 Vercel 프로젝트명** — `catkit-t1u6.vercel.app` 그대로 둡니다.
- GitHub 저장소명, 로컬 폴더명.

---

## 참고 — 검토했지만 우선순위에서 뺀 것

- 다크 모드 (현재 미지원)
- 히어로 CTA 버튼이 390px에서 두 줄로 쌓이는 것 — 탭하기엔 오히려 편해서 그대로 뒀습니다
