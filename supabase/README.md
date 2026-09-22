# Supabase

스키마와 시드 데이터는 Supabase 프로젝트에 **마이그레이션 11개**로 적용되어 있습니다.

```
20260922004511  catkit_core_schema                          브랜드 · 카테고리 · 상품 · 근거 · 수의사 · 병원 · 후기
20260922004531  catkit_commerce_schema                      프로필 · 주문 · 주문상품 · 상담
20260922004552  catkit_rls_policies                         전 테이블 RLS
20260922004753  catkit_seed_categories_brands               질환 5종 · 제조사 8곳
20260922004958  catkit_seed_products_renal_pancreatitis     신부전 · 췌장염 상품
20260922005216  catkit_seed_products_skin_allergy_recovery  피부 · 알러지 · 회복식 상품
20260922005447  catkit_seed_evidence                        검증된 근거 40여 건
20260922005626  catkit_seed_vets_clinics                    수의사 5명 · 병원 7곳
20260922005740  catkit_seed_testimonials                    추천글 31건
20260922010111  catkit_effective_price_and_search           정렬/검색용 생성 컬럼 + pg_trgm
20260922012646  catkit_lock_down_trigger_function           트리거 함수 EXECUTE 회수
```

## 로컬로 내려받기

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db pull          # 원격 스키마를 supabase/migrations/ 로 가져옵니다
```

## 새 프로젝트에 적용하기

```bash
npx supabase db push
```

## 테이블 구조

### 카탈로그 (공개 읽기 전용)
| 테이블 | 설명 |
|---|---|
| `brands` | 제조사 |
| `categories` | 질환 카테고리 — 관리 포인트(`care_points`), 색(`accent`) 포함 |
| `products` | 사료/습식/건강기능식품. `kind`, `supplement_kind`, `life_stage`, `rx_required` |
| `product_categories` | 상품 ↔ 질환 다대다 |
| `product_evidence` | 검증된 근거. `level`(A/B/C), `citation`, `url` |

### 케어 (공개 읽기 전용 + 상담은 본인만)
| 테이블 | 설명 |
|---|---|
| `vets` | 수의사 프로필. `career`(jsonb 타임라인), `education`, `specialties` |
| `clinics` | 동물병원. `hours`(jsonb), `facilities`, `night_care` |
| `clinic_vets` | 병원 ↔ 수의사 |
| `testimonials` | 추천글 (`target_type` = vet \| clinic) |
| `consultations` | 상담 신청 — 본인 것만 조회/생성 |

### 커머스 (본인 데이터만)
| 테이블 | 설명 |
|---|---|
| `profiles` | `auth.users` 가입 시 트리거로 자동 생성 |
| `orders` | `order_code`(토스 orderId), `status`, `amount`, `payment_key` |
| `order_items` | 주문 시점 상품 스냅샷 |

## 참고

- `products.effective_price` / `products.search_text` 는 생성 컬럼입니다. 직접 쓰지 마세요.
- Auth 설정 중 **Leaked Password Protection** 은 기본 비활성 상태입니다.
  운영 전환 시 대시보드 → Authentication → Policies 에서 켜주세요.
