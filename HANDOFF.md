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

## 남은 일

### 1. 모바일 상품 카드 실물 확인 (우선순위 높음)

상품 데이터가 실제로 채워진 상태에서 390px 폭으로 확인해 주세요.
2열로 바뀐 뒤 아직 실제 데이터로 검증하지 못한 유일한 부분입니다.

체크할 것 — 뱃지 줄바꿈이 과한지, 상품명이 어색하게 잘리는지,
가격과 별점이 붙어 보이는지. 어긋나면 `ProductCard.tsx`의 타입 스케일
(`text-[14px] sm:text-[15px]`, `p-3 sm:p-4` 등)로 조정하세요. 그리드 자체는 유지합니다.

### 2. 구 로고 파일 삭제

```
public/brand/catkit-logo.svg
public/brand/catkit-mark.svg
```

코드 어디서도 참조하지 않는 미사용 에셋입니다. 삭제 권한이 없어 남겨뒀습니다.

### 3. 빌드 후 배포

```bash
npm run build
git add -A && git commit && git push   # main push → Vercel 자동 배포
```

### 4. 배포 후 OG 이미지 확인

카톡이나 슬랙에 배포 URL을 던져 썸네일이 뜨는지 봐주세요.
`app/` 아래 파일명 컨벤션이라 별도 설정은 필요 없습니다.

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
