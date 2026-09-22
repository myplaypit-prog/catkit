import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getBrands, getCategories, getProducts } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters, SortSelect } from "@/components/ProductFilters";
import { Empty, btnPrimary } from "@/components/ui";
import { CategoryIcon } from "@/components/icons/CatArt";
import { SUPP_LABEL } from "@/lib/labels";
import type { SuppKind } from "@/lib/types";

export const metadata: Metadata = {
  title: "건강기능식품",
  description:
    "고양이 유산균, 오메가-3, 인 흡착제, 소화효소, 간 보조제. 질환별로 함께 쓰면 좋은 건강기능식품을 모았습니다.",
};

export const revalidate = 120;

type SP = Promise<Record<string, string | string[] | undefined>>;

function one(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

const SUPP_INTRO: Partial<Record<SuppKind, string>> = {
  probiotic: "항생제를 썼거나 설사가 이어질 때 장내 균총을 다시 세웁니다.",
  omega: "염증 반응을 낮춰 신장 · 피부 · 관절 전반에 두루 쓰입니다.",
  binder: "처방식만으로 혈중 인 수치가 잡히지 않을 때의 다음 단계.",
  enzyme: "췌장이 만들지 못하는 소화효소를 밖에서 대신 채워줍니다.",
  vitamin: "아연 · 비오틴 · B군처럼 부족하면 바로 티가 나는 영양소.",
  prescription: "간 · 신장 보조처럼 목적이 분명한 처방 보조 성분.",
  other: "퀘르세틴, 도포형 지질처럼 특정 상황을 겨냥한 제품.",
};

export default async function SupplementsPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;

  const [products, categories, brands] = await Promise.all([
    getProducts({
      kind: "supplement",
      condition: one(sp.condition),
      brand: one(sp.brand),
      life: one(sp.life),
      supp: one(sp.supp),
      rx: one(sp.rx),
      q: one(sp.q),
      sort: one(sp.sort),
    }),
    getCategories(),
    getBrands(),
  ]);

  const activeSupp = one(sp.supp) as SuppKind | undefined;

  return (
    <div>
      <section className="border-b border-line bg-gradient-to-b from-primary-soft/70 to-cream">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <nav className="mb-5 flex items-center gap-1.5 text-[12.5px] text-ink-faint">
            <Link href="/" className="transition hover:text-primary">
              홈
            </Link>
            <span>/</span>
            <span className="font-semibold text-ink-soft">건강기능식품</span>
          </nav>

          <h1 className="text-[30px] font-extrabold tracking-tight sm:text-[36px]">
            사료 옆에 한 칸 더
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            처방식은 바탕을 만들고, 건강기능식품은 부족한 한 칸을 채웁니다.
            유산균, 오메가-3, 인 흡착제, 소화효소처럼{" "}
            <b className="font-bold text-ink">목적이 분명한 제품</b>만 골랐고,
            각각 어떤 연구를 근거로 하는지 상세에 적어두었습니다.
          </p>

          {/* 종류 바로가기 */}
          <div className="no-scrollbar mt-7 flex gap-2 overflow-x-auto pb-1">
            <Link
              href="/supplements"
              className={
                "shrink-0 rounded-full border px-4 py-2 text-[13px] font-bold transition " +
                (!activeSupp
                  ? "border-primary bg-primary text-white"
                  : "border-line-strong bg-surface text-ink-soft hover:border-primary hover:text-primary")
              }
            >
              전체
            </Link>
            {(Object.keys(SUPP_LABEL) as SuppKind[]).map((k) => (
              <Link
                key={k}
                href={`/supplements?supp=${k}`}
                className={
                  "shrink-0 rounded-full border px-4 py-2 text-[13px] font-bold transition " +
                  (activeSupp === k
                    ? "border-primary bg-primary text-white"
                    : "border-line-strong bg-surface text-ink-soft hover:border-primary hover:text-primary")
                }
              >
                {SUPP_LABEL[k]}
              </Link>
            ))}
          </div>

          {activeSupp && SUPP_INTRO[activeSupp] ? (
            <p className="mt-4 rounded-2xl border border-line bg-surface px-4 py-3 text-[13.5px] text-ink-soft">
              {SUPP_INTRO[activeSupp]}
            </p>
          ) : null}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Suspense fallback={null}>
              <ProductFilters
                categories={categories}
                brands={brands}
                basePath="/supplements"
                lockKind
              />
            </Suspense>
          </aside>

          <section>
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="text-[13.5px] font-semibold text-ink-soft">
                총 <b className="font-extrabold text-ink">{products.length}</b>개
              </p>
              <Suspense fallback={null}>
                <SortSelect basePath="/supplements" />
              </Suspense>
            </div>

            {products.length === 0 ? (
              <Empty
                title="조건에 맞는 영양제가 없어요"
                desc="질환이나 종류 필터를 조금 풀어보시면 더 많은 제품이 보입니다."
                action={
                  <Link href="/supplements" className={btnPrimary}>
                    필터 초기화
                  </Link>
                }
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            {/* 질환별 바로가기 */}
            <div className="mt-12 rounded-[24px] border border-line bg-surface p-7">
              <p className="text-[15px] font-extrabold">
                우리 아이 진단명으로 다시 찾기
              </p>
              <p className="mt-1.5 text-[13px] text-ink-soft">
                질환을 고르면 그 상황에서 함께 쓰이는 영양제만 추려서 보여드려요.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/supplements?condition=${c.slug}`}
                    className="flex items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3.5 py-2 text-[13px] font-semibold transition hover:-translate-y-0.5"
                    style={{ color: c.accent }}
                  >
                    <CategoryIcon name={c.icon} size={15} />
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
