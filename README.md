# 캣킷 (catkit)

> 근거를 함께 적어두는 고양이 처방식 · 건강기능식품 스토어

아픈 고양이를 돌보는 보호자를 위해, 질환별 처방식과 건강기능식품을 모으고
**왜 이 제품인지**를 논문·진료 가이드라인과 함께 보여주는 쇼핑몰입니다.

| | |
|---|---|
| 프레임워크 | Next.js 16 (App Router) · React 19 · TypeScript |
| 스타일 | Tailwind CSS v4 · Pretendard |
| 데이터 · 인증 | Supabase (PostgreSQL + Auth + RLS) |
| 결제 | 토스페이먼츠 v2 결제위젯 (테스트 키) |
| 배포 | Vercel |

---

## 주요 기능

### 쇼핑
- **질환 5개 카테고리** — 신부전 · 췌장염 · 피부병 · 알러지 · 회복식
- 각 카테고리마다 "이 질환에서 꼭 챙겨야 할 것" 관리 포인트 제공
- 사료(건사료/습식)와 건강기능식품(유산균·오메가3·인흡착제·소화효소·간보조제)을 함께 취급
- **복합 검색/필터** — 질환 · 제조사 · 연령 · 제형 · 영양제 종류 · 처방전 필요 여부 · 키워드 · 정렬
- 한 제품이 여러 질환에 걸쳐 노출되는 다대다 매핑

### 검증된 근거
상품 상세마다 `product_evidence` 레코드를 붙여 다음을 노출합니다.

- 연구 제목 · 요약 (무엇을 확인했는지)
- 출처 저널/기관, 발표 연도, 전체 인용(citation)
- PubMed 등 **원문 링크**
- **근거 등급** — A(무작위 대조 연구·가이드라인) / B(대조군·코호트·종설) / C(기전·전문가 견해)

### 결제 (토스페이먼츠 v2)
1. 장바구니(localStorage) → 주문서 작성
2. 결제 전에 `orders`를 `pending`으로 저장
3. 결제위젯 `renderPaymentMethods()` + `renderAgreement()` 렌더
4. `requestPayment({ orderId, successUrl, failUrl })`
5. `POST /api/payments/confirm` 에서
   - 로그인 사용자 확인
   - 주문 소유자 확인
   - **쿼리스트링이 아닌 DB에 저장된 금액**과 대조 (위변조 차단)
   - `Basic base64(secretKey + ":")` 로 토스 승인 API 호출
   - `Idempotency-Key`로 중복 승인 방지
6. 성공/실패 페이지 → 주문 내역

### 케어
- **전문 수의사 상담** — 소개글 · 약력 타임라인 · 학력 · 전문분야 · 보호자 추천글 · 상담 신청 폼
- **우리 동네 동물병원** — 지역/키워드 검색, 24시 응급 필터, 진료시간, 시설·장비, 소속 수의사, 추천글

---

## 시작하기

```bash
npm install
cp .env.example .env.local   # 값을 채워주세요
npm run dev
```

### 환경변수

| 변수 | 설명 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable(anon) 키 |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY` | 토스 결제위젯 클라이언트 키 `test_gck_...` |
| `TOSS_SECRET_KEY` | 토스 시크릿 키 `test_gsk_...` — **서버 전용** |
| `NEXT_PUBLIC_SITE_URL` | 배포 주소 |

기본값으로 토스페이먼츠 공식 문서에 공개된 테스트 키가 들어 있습니다.
실제 서비스 전에는 [토스페이먼츠 개발자센터](https://developers.tosspayments.com)에서
본인 계정의 키로 교체하세요. `live_` 키 발급에는 사업자등록과 심사가 필요합니다.

---

## 데이터베이스

Supabase에 아래 테이블이 생성되어 있습니다. 모든 테이블에 RLS가 켜져 있고,
카탈로그는 공개 읽기 전용 / 주문·상담은 본인 데이터만 접근할 수 있습니다.

```
카탈로그   brands · categories · products · product_categories · product_evidence
케어       vets · clinics · clinic_vets · testimonials · consultations
커머스     profiles · orders · order_items
```

검색·정렬을 위해 `products`에 생성 컬럼 두 개를 두었습니다.

- `effective_price` — `least(sale_price, price)`, 가격 정렬용
- `search_text` — 이름/영문명/요약/설명 통합, `pg_trgm` GIN 인덱스

---

## 디렉터리

```
src/
  app/
    page.tsx                     홈
    products/                    처방식 목록 · 상세(근거 포함)
    categories/[slug]/           질환별 랜딩
    supplements/                 건강기능식품
    cart/ checkout/ orders/      장바구니 → 결제 → 주문내역
    api/payments/confirm/        토스 승인 (금액 서버 검증)
    vets/ clinics/               수의사 상담 · 동네 병원
    login/
  components/
    icons/CatArt.tsx             고양이 SVG 일러스트 세트
    ProductThumb.tsx             제형별 패키지 일러스트
    ...
  lib/
    supabase/                    브라우저 · 서버 · 세션 갱신 클라이언트
    queries.ts labels.ts format.ts types.ts
  proxy.ts                       Supabase 세션 갱신
public/illustrations/            고양이 PNG 일러스트
```

---

## 디자인

레퍼런스의 부드러운 파스텔 고양이 톤을 가져와, 병원·처방이라는 무거운 주제에
맞게 조금 더 차분한 웜톤으로 옮겼습니다.

| 토큰 | 값 | 쓰임 |
|---|---|---|
| `--cream` | `#FFFBF6` | 배경 |
| `--primary` | `#E07A46` | 살구 — CTA, 강조 |
| `--sage` | `#6F9B6A` | 세이지 — 근거·안전 |
| `--sky` | `#5F93B8` | 신부전 |
| `--honey` | `#E3A23C` | 췌장염 · 별점 |
| `--mauve` | `#BE7FA1` | 피부병 |

고양이 얼굴·카테고리 아이콘·제품 패키지·빈 상태 일러스트는
`CatArt.tsx` / `ProductThumb.tsx` 에 인라인 SVG로 직접 그렸습니다.

---

## ⚠️ 안내

이 프로젝트는 **학습·시연용 데모**입니다.

- 수의사 · 동물병원 정보와 후기는 실제 인물/기관이 아닌 예시 데이터입니다.
- 상품 설명과 근거 자료는 보호자의 이해를 돕기 위한 참고 정보이며,
  수의사의 진단과 처방을 대신하지 않습니다.
- 인용된 논문·가이드라인은 실존하는 자료이지만, 해당 성분이나 식이 전략 전반에
  대한 연구이지 개별 제품 하나하나를 검증한 결과가 아닙니다.
- 결제는 토스페이먼츠 **테스트 키**로 동작하므로 실제 금액이 청구되지 않고
  상품도 배송되지 않습니다.
