import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  getBrands,
  getCategories,
  getCategory,
  getProducts,
  getVets,
} from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters, SortSelect } from "@/components/ProductFilters";
import { CategoryIcon, CatFace, FUR_NAMES } from "@/components/icons/CatArt";
import { Badge, Card, Empty, Rating, SectionHead, btnGhost, btnPrimary } from "@/components/ui";
import { Check, ChevronRight } from "@/components/icons/Ico";
import { hashIndex } from "@/lib/format";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;
type SP = Promise<Record<string, string | string[] | undefined>>;

function one(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: "질환을 찾을 수 없습니다" };
  return {
    title: `${category.name} 처방식 · 영양제`,
    description: category.description ?? undefined,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SP;
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const category = await getCategory(slug);
  if (!category) notFound();

  const [products, categories, brands, vets] = await Promise.all([
    getProducts({
      condition: slug,
      kind: one(sp.kind),
      brand: one(sp.brand),
      life: one(sp.life),
      supp: one(sp.supp),
      rx: one(sp.rx),
      q: one(sp.q),
      sort: one(sp.sort),
    }),
    getCategories(),
    getBrands(),
    getVets(),
  ]);

  const foods = products.filter((p) => p.kind !== "supplement");
  const supps = products.filter((p) => p.kind === "supplement");

  // 이 질환을 전문으로 보는 수의사 추천
  const matchedVets = vets.filter((v) =>
    v.specialties.some(
      (s) => s.includes(category.name) || category.name.includes(s.slice(0, 2)),
    ),
  );
  const suggestedVets = (matchedVets.length > 0 ? matchedVets : vets).slice(0, 2);

  return (
    <div>
      {/* ── 질환 히어로 ───────────────────────────────── */}
      <section
        className="border-b border-line"
        style={{
          background: `linear-gradient(160deg, ${category.accent_soft} 0%, var(--cream) 72%)`,
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          <nav className="mb-5 flex items-center gap-1.5 text-[12.5px] text-ink-faint">
            <Link href="/" className="transition hover:text-primary">
              홈
            </Link>
            <span>/</span>
            <Link href="/products" className="transition hover:text-primary">
              처방식
            </Link>
            <span>/</span>
            <span className="font-semibold text-ink-soft">{category.name}</span>
          </nav>

          <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <span
                className="grid h-14 w-14 place-items-center rounded-2xl bg-surface"
                style={{ color: category.accent }}
              >
                <CategoryIcon name={category.icon} size={28} />
              </span>
              <h1 className="mt-5 text-[32px] font-extrabold tracking-tight sm:text-[38px]">
                {category.name}
              </h1>
              <p
                className="mt-2 text-[15px] font-bold"
                style={{ color: category.accent }}
              >
                {category.tagline}
              </p>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
                {category.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#products" className={btnPrimary}>
                  {category.name} 상품 {products.length}개 보기
                  <ChevronRight size={16} />
                </a>
                <Link href="/vets" className={btnGhost}>
                  수의사에게 물어보기
                </Link>
              </div>
            </div>

            <Card className="p-7">
              <p className="text-[12px] font-extrabold tracking-wide text-ink-faint">
                이 질환에서 꼭 챙겨야 할 것
              </p>
              <ul className="mt-4 space-y-3">
                {category.care_points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <span
                      className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white"
                      style={{ background: category.accent }}
                    >
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <span className="text-[13.5px] font-semibold leading-relaxed">
                      {p}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* ── 상품 ──────────────────────────────────────── */}
      <div
        id="products"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6"
      >
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Suspense fallback={null}>
              <ProductFilters
                categories={categories}
                brands={brands}
                basePath={`/categories/${slug}`}
              />
            </Suspense>
          </aside>

          <div className="space-y-14">
            <section>
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-[20px] font-extrabold">사료 · 습식</h2>
                  <p className="mt-1 text-[13px] text-ink-soft">
                    {foods.length}개 상품
                  </p>
                </div>
                <Suspense fallback={null}>
                  <SortSelect basePath={`/categories/${slug}`} />
                </Suspense>
              </div>

              {foods.length === 0 ? (
                <Empty
                  title="조건에 맞는 사료가 없어요"
                  desc="필터를 조금 풀어보시면 더 많은 상품이 보입니다."
                  action={
                    <Link href={`/categories/${slug}`} className={btnPrimary}>
                      필터 초기화
                    </Link>
                  }
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {foods.map((p) => (
                    <ProductCard key={p.id} product={p} showCategory={false} />
                  ))}
                </div>
              )}
            </section>

            {supps.length > 0 ? (
              <section>
                <SectionHead
                  eyebrow="함께 쓰면 좋은"
                  title="건강기능식품"
                  desc={`${category.name} 관리에서 사료만으로 부족한 부분을 채워주는 제품들입니다.`}
                />
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {supps.map((p) => (
                    <ProductCard key={p.id} product={p} showCategory={false} />
                  ))}
                </div>
              </section>
            ) : null}

            {/* 이 질환 전문 수의사 */}
            <section>
              <SectionHead
                eyebrow="더 물어볼 게 남았다면"
                title={`${category.name}을(를) 많이 보는 수의사`}
                href="/vets"
                hrefLabel="전체 보기"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                {suggestedVets.map((v) => (
                  <Link
                    key={v.slug}
                    href={`/vets/${v.slug}`}
                    className="group flex gap-4 rounded-[22px] border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
                  >
                    <span
                      className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl"
                      style={{ background: v.accent + "1F" }}
                    >
                      <CatFace
                        fur={FUR_NAMES[hashIndex(v.slug, FUR_NAMES.length)]}
                        mood="curious"
                        size={52}
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[15px] font-extrabold transition group-hover:text-primary">
                        {v.name} 수의사
                      </p>
                      <p
                        className="mt-0.5 text-[12px] font-semibold"
                        style={{ color: v.accent }}
                      >
                        {v.title}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {v.specialties.slice(0, 2).map((s) => (
                          <Badge key={s}>{s}</Badge>
                        ))}
                      </div>
                      <div className="mt-2.5">
                        <Rating value={v.rating} count={v.review_count} size={13} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
