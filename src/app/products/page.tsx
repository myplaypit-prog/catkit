import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getBrands, getCategories, getProducts } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters, SortSelect } from "@/components/ProductFilters";
import { Empty, btnPrimary } from "@/components/ui";

export const metadata: Metadata = {
  title: "처방식 전체",
  description:
    "신부전, 췌장염, 피부병, 알러지, 회복식. 질환·제조사·연령·제형으로 좁혀 고양이 처방식을 찾아보세요.",
};

export const revalidate = 120;

type SP = Promise<Record<string, string | string[] | undefined>>;

function one(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;

  const filters = {
    condition: one(sp.condition),
    kind: one(sp.kind),
    brand: one(sp.brand),
    life: one(sp.life),
    supp: one(sp.supp),
    rx: one(sp.rx),
    q: one(sp.q),
    sort: one(sp.sort),
  };

  const [products, categories, brands] = await Promise.all([
    getProducts(filters),
    getCategories(),
    getBrands(),
  ]);

  const activeCategory = filters.condition
    ? categories.find((c) => c.slug === filters.condition)
    : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="mb-4 flex items-center gap-1.5 text-[12.5px] text-ink-faint">
        <Link href="/" className="transition hover:text-primary">
          홈
        </Link>
        <span>/</span>
        <span className="font-semibold text-ink-soft">처방식 전체</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-[28px] font-extrabold tracking-tight sm:text-[32px]">
          {activeCategory ? `${activeCategory.name} 처방식` : "처방식 전체"}
        </h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
          {activeCategory
            ? activeCategory.description
            : "질환, 제조사, 연령, 제형으로 좁혀보세요. 모든 상품에는 그 설계를 뒷받침하는 연구와 가이드라인이 함께 적혀 있습니다."}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Suspense fallback={<FilterSkeleton />}>
            <ProductFilters
              categories={categories}
              brands={brands}
              basePath="/products"
            />
          </Suspense>
        </aside>

        <section>
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-[13.5px] font-semibold text-ink-soft">
              총 <b className="font-extrabold text-ink">{products.length}</b>개
              {filters.q ? (
                <span className="ml-1 text-ink-faint">
                  · &ldquo;{filters.q}&rdquo; 검색 결과
                </span>
              ) : null}
            </p>
            <Suspense fallback={null}>
              <SortSelect basePath="/products" />
            </Suspense>
          </div>

          {products.length === 0 ? (
            <Empty
              title="조건에 맞는 상품이 아직 없어요"
              desc="필터를 하나씩 풀어보시거나, 질환만 선택해 다시 찾아보세요. 찾으시는 제품이 있다면 상담으로 알려주세요."
              action={
                <Link href="/products" className={btnPrimary}>
                  필터 초기화
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FilterSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-11 animate-pulse rounded-2xl bg-cream-deep" />
      ))}
    </div>
  );
}
