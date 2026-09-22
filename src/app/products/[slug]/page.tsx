import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getRelatedProducts } from "@/lib/queries";
import { ProductThumb } from "@/components/ProductThumb";
import { ProductCard } from "@/components/ProductCard";
import { AddToCartPanel } from "@/components/AddToCart";
import { Badge, Card, Rating, RxBadge, SectionHead } from "@/components/ui";
import { CategoryIcon } from "@/components/icons/CatArt";
import {
  Book,
  Check,
  Clock,
  External,
  Shield,
  Sparkle,
  Truck,
} from "@/components/icons/Ico";
import { discountRate, finalPrice, won } from "@/lib/format";
import {
  EVIDENCE_LABEL,
  EVIDENCE_SHORT,
  EVIDENCE_TONE,
  KIND_LABEL,
  LIFE_STAGE_LABEL,
  SOURCE_TYPE_LABEL,
  SUPP_LABEL,
  analysisLabel,
  sortAnalysis,
} from "@/lib/labels";
import type { Evidence } from "@/lib/types";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "상품을 찾을 수 없습니다" };
  return {
    title: product.name,
    description: product.short_desc,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(
    product.primary_category_id,
    product.id,
    4,
  );

  const price = finalPrice(product.price, product.sale_price);
  const off = discountRate(product.price, product.sale_price);
  const accent = product.accent ?? product.category?.accent ?? "#E07A46";
  const analysisEntries = sortAnalysis(product.analysis ?? {});

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[12.5px] text-ink-faint">
        <Link href="/" className="transition hover:text-primary">
          홈
        </Link>
        <span>/</span>
        <Link href="/products" className="transition hover:text-primary">
          처방식
        </Link>
        <span>/</span>
        <Link
          href={`/categories/${product.category.slug}`}
          className="transition hover:text-primary"
        >
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="font-semibold text-ink-soft">{product.name}</span>
      </nav>

      {/* ── 상단: 이미지 + 구매 ────────────────────────── */}
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="overflow-hidden rounded-[26px] border border-line">
            <ProductThumb
              kind={product.kind}
              accent={accent}
              seed={product.slug}
              className="aspect-[4/3] w-full"
            />
          </div>

          {product.highlights.length > 0 ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {product.highlights.map((h) => (
                <div
                  key={h}
                  className="flex items-start gap-2 rounded-2xl border border-line bg-surface px-3.5 py-3"
                >
                  <span
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white"
                    style={{ background: accent }}
                  >
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <span className="text-[13px] font-semibold leading-snug">
                    {h}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              fg={product.category.accent}
              bg={product.category.accent_soft}
            >
              <CategoryIcon name={product.category.icon} size={13} />
              {product.category.name}
            </Badge>
            <Badge>{KIND_LABEL[product.kind]}</Badge>
            {product.supplement_kind ? (
              <Badge>{SUPP_LABEL[product.supplement_kind]}</Badge>
            ) : null}
            {product.rx_required ? <RxBadge /> : null}
          </div>

          <p className="mt-4 text-[13px] font-bold text-ink-faint">
            {product.brand.name}
            {product.brand.country ? ` · ${product.brand.country}` : ""}
          </p>
          <h1 className="mt-1.5 text-[26px] font-extrabold leading-snug tracking-tight sm:text-[30px]">
            {product.name}
          </h1>
          {product.name_en ? (
            <p className="mt-1 text-[13px] text-ink-faint">{product.name_en}</p>
          ) : null}

          <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
            {product.short_desc}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <Rating value={product.rating} count={product.review_count} size={16} />
            {product.evidence.length > 0 ? (
              <a
                href="#evidence"
                className="inline-flex items-center gap-1 text-[12.5px] font-bold text-sage transition hover:underline"
              >
                <Book size={14} />
                근거 자료 {product.evidence.length}건
              </a>
            ) : null}
          </div>

          <div className="mt-6 flex items-end gap-3">
            {off > 0 ? (
              <>
                <span className="text-[22px] font-extrabold text-primary">
                  {off}%
                </span>
                <span className="text-[15px] text-ink-faint line-through">
                  {won(product.price)}
                </span>
              </>
            ) : null}
          </div>
          <p className="text-[32px] font-extrabold tracking-tight">
            {won(price)}
            {product.unit_label ? (
              <span className="ml-2 text-[14px] font-bold text-ink-faint">
                / {product.unit_label}
              </span>
            ) : null}
          </p>

          <div className="mt-6">
            <AddToCartPanel product={product} />
          </div>

          <div className="mt-6 space-y-2.5 rounded-[22px] border border-line bg-cream-deep/40 p-5">
            <InfoRow icon={<Truck size={16} />} label="배송">
              5만원 이상 무료배송 · 미만 시 3,000원
            </InfoRow>
            <InfoRow icon={<Clock size={16} />} label="출고">
              평일 오후 2시 이전 주문 시 당일 출고
            </InfoRow>
            <InfoRow icon={<Sparkle size={16} />} label="연령">
              {LIFE_STAGE_LABEL[product.life_stage]}
            </InfoRow>
            {product.rx_required ? (
              <InfoRow icon={<Shield size={16} />} label="처방">
                수의사 처방 또는 진단 확인 후 급여해 주세요
              </InfoRow>
            ) : null}
          </div>

          {product.cautions.length > 0 ? (
            <div className="mt-4 rounded-[22px] border border-primary/25 bg-primary-soft/60 p-5">
              <p className="text-[13px] font-extrabold text-primary-deep">
                급여 전 확인해 주세요
              </p>
              <ul className="mt-2.5 space-y-1.5">
                {product.cautions.map((c) => (
                  <li
                    key={c}
                    className="flex items-start gap-2 text-[13px] leading-relaxed text-ink-soft"
                  >
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      {/* ── 상세 설명 ─────────────────────────────────── */}
      <section className="mt-16">
        <SectionHead eyebrow="이 제품은" title="어떤 아이에게, 왜 필요한가요" />
        <Card className="p-7 sm:p-9">
          <div className="prose-warm max-w-3xl text-[15px]">
            {product.description.split("\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </Card>
      </section>

      {/* ── 검증된 근거 ───────────────────────────────── */}
      {product.evidence.length > 0 ? (
        <section id="evidence" className="mt-16 scroll-mt-24">
          <SectionHead
            eyebrow="검증된 근거"
            title="이 설계를 뒷받침하는 연구들"
            desc="제조사의 설명이 아니라, 학술지에 실린 연구와 진료 가이드라인을 그대로 옮겼습니다. 원문 링크를 눌러 직접 확인하실 수 있습니다."
          />

          <div className="mb-5 flex flex-wrap gap-2">
            {(["A", "B", "C"] as const).map((lv) => (
              <span
                key={lv}
                className="rounded-full px-3 py-1.5 text-[11.5px] font-semibold"
                style={{
                  color: EVIDENCE_TONE[lv].fg,
                  background: EVIDENCE_TONE[lv].bg,
                }}
              >
                <b className="font-extrabold">{EVIDENCE_SHORT[lv]}</b> —{" "}
                {EVIDENCE_LABEL[lv]}
              </span>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {product.evidence.map((ev) => (
              <EvidenceCard key={ev.id} ev={ev} />
            ))}
          </div>

          <p className="mt-5 rounded-2xl border border-line bg-cream-deep/40 px-5 py-4 text-[12.5px] leading-relaxed text-ink-soft">
            여기 실린 자료는 해당 성분이나 식이 전략 전반에 대한 연구이며, 개별
            제품 하나하나를 검증한 결과가 아닙니다. 우리 아이에게 적용할 수
            있을지는 반드시 담당 수의사와 상의해 주세요.
          </p>
        </section>
      ) : null}

      {/* ── 성분 · 급여 ───────────────────────────────── */}
      <section className="mt-16 grid gap-4 lg:grid-cols-2">
        {analysisEntries.length > 0 ? (
          <Card className="p-7">
            <h3 className="text-[17px] font-extrabold">보장 성분 분석</h3>
            <dl className="mt-4 divide-y divide-line">
              {analysisEntries.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-2.5">
                  <dt className="text-[13.5px] text-ink-soft">
                    {analysisLabel(k)}
                  </dt>
                  <dd className="text-[13.5px] font-bold tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
        ) : null}

        <div className="space-y-4">
          {product.feeding_guide ? (
            <Card className="p-7">
              <h3 className="text-[17px] font-extrabold">급여 가이드</h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
                {product.feeding_guide}
              </p>
            </Card>
          ) : null}

          {product.ingredients ? (
            <Card className="p-7">
              <h3 className="text-[17px] font-extrabold">원재료</h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
                {product.ingredients}
              </p>
            </Card>
          ) : null}
        </div>
      </section>

      {/* ── 관련 질환 ─────────────────────────────────── */}
      {product.categories.length > 0 ? (
        <section className="mt-16">
          <SectionHead
            eyebrow="이 제품이 도움이 되는"
            title="관련 질환"
            desc="한 제품이 여러 질환 관리에 함께 쓰이기도 합니다."
          />
          <div className="flex flex-wrap gap-2.5">
            {product.categories.map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="flex items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-3 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
              >
                <span
                  className="grid h-8 w-8 place-items-center rounded-xl"
                  style={{ background: c.accent_soft, color: c.accent }}
                >
                  <CategoryIcon name={c.icon} size={17} />
                </span>
                <span>
                  <span className="block text-[13.5px] font-bold">{c.name}</span>
                  <span className="block text-[11.5px] text-ink-faint">
                    {c.tagline}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── 함께 보면 좋은 ────────────────────────────── */}
      {related.length > 0 ? (
        <section className="mt-16">
          <SectionHead
            eyebrow={`${product.category.name} 관리`}
            title="함께 보면 좋은 상품"
            href={`/categories/${product.category.slug}`}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-px text-ink-faint">{icon}</span>
      <p className="text-[13px] leading-relaxed">
        <b className="mr-2 font-bold">{label}</b>
        <span className="text-ink-soft">{children}</span>
      </p>
    </div>
  );
}

function EvidenceCard({ ev }: { ev: Evidence }) {
  const tone = EVIDENCE_TONE[ev.level];
  return (
    <article className="flex h-full flex-col rounded-[22px] border border-line bg-surface p-6 transition hover:shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-extrabold"
          style={{ color: tone.fg, background: tone.bg }}
        >
          {EVIDENCE_SHORT[ev.level]}
        </span>
        <Badge>
          {SOURCE_TYPE_LABEL[ev.source_type] ?? ev.source_type}
        </Badge>
        {ev.year ? <Badge>{ev.year}년</Badge> : null}
      </div>

      <h4 className="mt-3.5 text-[15.5px] font-extrabold leading-snug">
        {ev.title}
      </h4>
      <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft">
        {ev.summary}
      </p>

      <div className="mt-auto pt-5">
        <p className="text-[12px] font-bold" style={{ color: tone.fg }}>
          {ev.source_name}
        </p>
        {ev.citation ? (
          <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-faint">
            {ev.citation}
          </p>
        ) : null}
        {ev.url ? (
          <a
            href={ev.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-primary transition hover:underline"
          >
            원문 보기
            <External size={13} />
          </a>
        ) : null}
      </div>
    </article>
  );
}
