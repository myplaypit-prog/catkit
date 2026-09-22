import Link from "next/link";
import Image from "next/image";
import {
  getCategories,
  getClinics,
  getFeaturedTestimonials,
  getProducts,
  getVets,
} from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { CatFaceStack } from "@/components/HeroArt";
import { HeroArtNew } from "@/components/HeroArtNew";
import { CategoryIcon, CatFace } from "@/components/icons/CatArt";
import { Badge, Card, Rating, SectionHead, btnGhost, btnPrimary } from "@/components/ui";
import {
  Book,
  Check,
  ChevronRight,
  Clock,
  Phone,
  Pin,
  Shield,
  Sparkle,
  Truck,
} from "@/components/icons/Ico";
import { hashIndex } from "@/lib/format";
import { FUR_NAMES } from "@/components/icons/CatArt";

export const revalidate = 300;

export default async function HomePage() {
  const [categories, popular, supplements, vets, clinics, testimonials] =
    await Promise.all([
      getCategories(),
      getProducts({ sort: "recommend", limit: 8 }),
      getProducts({ kind: "supplement", sort: "review", limit: 4 }),
      getVets(),
      getClinics(),
      getFeaturedTestimonials(6),
    ]);

  return (
    <>
      {/* ── 히어로 ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-line bg-[#F1E8DC]">
        <div className="paper-noise absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:pb-16 lg:pt-14">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white/70 px-3.5 py-1.5 text-[12px] font-bold text-primary-deep">
              <Sparkle size={14} /> CATKIT CARE CURATION
            </span>

            <h1 className="brand-display mt-6 text-[39px] font-bold leading-[1.22] text-ink sm:text-[52px] lg:text-[56px]">
              아이가 나와 함께<br />오래도록, <span className="text-primary">건강하게.</span>
            </h1>

            <p className="mt-6 max-w-lg text-[16px] font-semibold leading-relaxed text-ink-soft">
              믿을 수 있는 제품을 먼저.<span className="mt-2 block text-[14px] font-normal leading-relaxed">질환별 영양 기준과 성분, 논문과 진료 가이드라인까지 살펴 우리 아이에게 필요한 선택만 차분하게 안내합니다.</span>
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className={btnPrimary}>
                건강 고민별 제품 보기
                <ChevronRight size={17} />
              </Link>
              <Link href="/vets" className={btnGhost}>
                전문 수의사 상담
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <div className="flex items-center gap-2.5">
                <CatFaceStack />
                <p className="text-[12.5px] leading-tight text-ink-soft">
                  <b className="font-bold text-ink">2,480명의 보호자</b>가<br />캣킷의 기준으로 함께 고르고 있어요
                </p>
              </div>
            </div>
          </div>

          <div className="animate-rise" style={{ animationDelay: "120ms" }}>
            <HeroArtNew />
          </div>
        </div>

        {/* 신뢰 스트립 */}
        <div className="relative border-t border-line bg-white/72">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 sm:grid-cols-3 sm:px-6">
            <TrustItem
              icon={<Book size={18} />}
              title="논문 · 가이드라인 표기"
              desc="상세페이지마다 근거 등급과 원문 링크"
            />
            <TrustItem
              icon={<Shield size={18} />}
              title="수의사 처방 안내"
              desc="처방식은 처방 필요 여부를 명확히 표시"
            />
            <TrustItem
              icon={<Truck size={18} />}
              title="5만원 이상 무료배송"
              desc="오후 2시 이전 주문은 당일 출고"
            />
          </div>
        </div>
      </section>

      {/* ── 질환 카테고리 ──────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHead
          eyebrow="어떤 진단을 받으셨나요"
          title="질환별로 먼저 좁혀보세요"
          desc="진단명을 고르면 그 질환에서 무엇을 조절해야 하는지, 어떤 제품이 그 조건을 만족하는지 한 번에 보여드립니다."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className="group relative overflow-hidden rounded-[24px] border border-line bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            >
              <div
                className="absolute -right-8 -top-10 h-32 w-32 rounded-full opacity-60 transition duration-500 group-hover:scale-125"
                style={{ background: c.accent_soft }}
              />
              <div className="relative">
                <span
                  className="grid h-12 w-12 place-items-center rounded-2xl"
                  style={{ background: c.accent_soft, color: c.accent }}
                >
                  <CategoryIcon name={c.icon} size={24} />
                </span>
                <h3 className="mt-4 text-[19px] font-extrabold">{c.name}</h3>
                <p
                  className="mt-1 text-[13px] font-semibold"
                  style={{ color: c.accent }}
                >
                  {c.tagline}
                </p>
                <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-ink-soft">
                  {c.description}
                </p>
                <ul className="mt-4 space-y-1.5">
                  {c.care_points.slice(0, 2).map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-1.5 text-[12.5px] text-ink-soft"
                    >
                      <Check
                        size={15}
                        className="mt-0.5 shrink-0"
                        strokeWidth={2.4}
                      />
                      {p}
                    </li>
                  ))}
                </ul>
                <span className="mt-5 inline-flex items-center gap-1 text-[13px] font-bold text-primary">
                  이 질환 상품 보기
                  <ChevronRight size={15} />
                </span>
              </div>
              <CatFace
                fur={FUR_NAMES[i % FUR_NAMES.length]}
                size={62}
                className="absolute -bottom-2 right-2 opacity-90 transition duration-300 group-hover:-translate-y-1"
              />
            </Link>
          ))}

          <Link
            href="/supplements"
            className="group flex flex-col justify-between overflow-hidden rounded-[24px] border border-dashed border-primary/40 bg-primary-soft/50 p-6 transition hover:-translate-y-1 hover:bg-primary-soft"
          >
            <div>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-surface text-primary">
                <Sparkle size={24} />
              </span>
              <h3 className="mt-4 text-[19px] font-extrabold">건강기능식품</h3>
              <p className="mt-1 text-[13px] font-semibold text-primary">
                사료만으로 부족할 때 한 칸 더
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">
                유산균, 오메가-3, 인 흡착제, 소화효소, 간 보조제까지. 질환별로
                함께 쓰면 좋은 조합을 정리해 두었습니다.
              </p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1 text-[13px] font-bold text-primary">
              영양제 보러가기
              <ChevronRight size={15} />
            </span>
          </Link>
        </div>
      </section>

      {/* ── 인기 상품 ──────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <SectionHead
          eyebrow="보호자들이 많이 고른"
          title="지금 가장 많이 담는 처방식"
          href="/products"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── 근거 배너 ──────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="overflow-hidden rounded-[32px] border border-line bg-gradient-to-br from-sage-soft via-cream to-honey-soft shadow-[var(--shadow-soft)]">
          <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <Badge fg="#4F7F4A" bg="#FFFFFF">
                <Book size={13} /> 근거 표기 원칙
              </Badge>
              <h2 className="mt-4 text-[24px] font-extrabold leading-snug sm:text-[30px]">
                &ldquo;좋아요&rdquo; 대신
                <br />
                <span className="text-sage">어떤 근거에서 그랬는지</span>를 적습니다
              </h2>
              <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-ink-soft">
                모든 상품 상세에는 그 성분과 설계를 뒷받침하는 연구·가이드라인이
                붙어 있습니다. 저널명, 발표 연도, 원문 링크까지 그대로 열어두고,
                근거의 강도도 A·B·C로 구분해 표시합니다.
              </p>
              <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
                <EvidenceChip
                  level="A"
                  fg="#4F7F4A"
                  bg="#FFFFFF"
                  desc="무작위 대조 연구 · 진료 가이드라인"
                />
                <EvidenceChip
                  level="B"
                  fg="#8A6048"
                  bg="#FFFFFF"
                  desc="대조군 연구 · 코호트 · 종설"
                />
                <EvidenceChip
                  level="C"
                  fg="#A9813A"
                  bg="#FFFFFF"
                  desc="기전 연구 · 전문가 견해"
                />
              </div>
              <Link
                href="/products?rx=rx"
                className={btnGhost + " mt-7"}
              >
                근거가 붙은 처방식 보기
                <ChevronRight size={16} />
              </Link>
            </div>
            <div className="relative hidden justify-center lg:flex">
              <Image
                src="/illustrations/cat-calico.png"
                alt="자연스러운 삼색 고양이 일러스트"
                width={512}
                height={512}
                className="animate-floaty w-[74%] drop-shadow-[0_18px_28px_rgba(122,88,60,0.14)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 건강기능식품 ──────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <SectionHead
          eyebrow="사료 옆에 한 칸 더"
          title="질환에 맞춘 건강기능식품"
          desc="처방식만으로 잡히지 않는 수치가 있습니다. 유산균, 인 흡착제, 오메가-3처럼 목적이 분명한 제품만 골랐어요."
          href="/supplements"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {supplements.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── 수의사 ────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <SectionHead
          eyebrow="혼자 고민하지 마세요"
          title="전문 수의사에게 물어보기"
          desc="진료실에서 못 다 물어본 것들이 있죠. 질환별 전문 수의사에게 우리 아이 상황을 그대로 적어 보내보세요."
          href="/vets"
          hrefLabel="수의사 전체 보기"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {vets.slice(0, 3).map((v) => (
            <Link
              key={v.slug}
              href={`/vets/${v.slug}`}
              className="group rounded-[24px] border border-line bg-surface p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="flex items-center gap-3">
                <span
                  className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl"
                  style={{ background: v.accent + "1F" }}
                >
                  <CatFace
                    fur={FUR_NAMES[hashIndex(v.slug, FUR_NAMES.length)]}
                    mood="curious"
                    size={52}
                  />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[16px] font-extrabold">
                    {v.name} 수의사
                  </p>
                  <p
                    className="truncate text-[12.5px] font-semibold"
                    style={{ color: v.accent }}
                  >
                    {v.title}
                  </p>
                </div>
              </div>
              <p className="mt-4 line-clamp-3 text-[13.5px] leading-relaxed text-ink-soft">
                {v.intro}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {v.specialties.slice(0, 3).map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                <Rating value={v.rating} count={v.review_count} />
                <span className="text-[12.5px] font-bold text-primary">
                  경력 {v.years}년
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 동물병원 ──────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <SectionHead
          eyebrow="가까운 곳부터"
          title="우리 동네 동물병원"
          desc="고양이를 편하게 봐주는 병원, 야간에 문을 여는 병원, 피부만 보는 병원. 우리 아이에게 필요한 곳을 찾아보세요."
          href="/clinics"
          hrefLabel="병원 전체 보기"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {clinics.slice(0, 3).map((c) => (
            <Link
              key={c.slug}
              href={`/clinics/${c.slug}`}
              className="group rounded-[24px] border border-line bg-surface p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge fg={c.accent} bg={c.accent + "1A"}>
                  {c.region} {c.district}
                </Badge>
                {c.night_care ? (
                  <Badge fg="#C25F2C" bg="#FDEDE3">
                    24시 응급
                  </Badge>
                ) : null}
                {c.cat_friendly ? <Badge>캣 프렌들리</Badge> : null}
              </div>
              <h3 className="mt-3 text-[17px] font-extrabold transition group-hover:text-primary">
                {c.name}
              </h3>
              <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-ink-soft">
                {c.intro}
              </p>
              <div className="mt-4 space-y-1.5 text-[12.5px] text-ink-soft">
                <p className="flex items-center gap-1.5">
                  <Pin size={14} className="shrink-0 text-ink-faint" />
                  <span className="truncate">{c.address}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock size={14} className="shrink-0 text-ink-faint" />
                  평일 {c.hours["평일"] ?? "문의"}
                </p>
                {c.phone ? (
                  <p className="flex items-center gap-1.5">
                    <Phone size={14} className="shrink-0 text-ink-faint" />
                    {c.phone}
                  </p>
                ) : null}
              </div>
              <div className="mt-4 border-t border-line pt-4">
                <Rating value={c.rating} count={c.review_count} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 후기 ──────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
        <SectionHead
          eyebrow="보호자들의 이야기"
          title="같은 길을 먼저 걸은 분들"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.id} className="p-6">
              <Rating value={t.rating} size={15} />
              <p className="mt-3 line-clamp-4 text-[13.5px] leading-relaxed text-ink-soft">
                {t.body}
              </p>
              <div className="mt-4 flex items-center gap-2.5 border-t border-line pt-4">
                <CatFace
                  fur={FUR_NAMES[hashIndex(t.author, FUR_NAMES.length)]}
                  size={34}
                />
                <p className="text-[12.5px] font-bold">
                  {t.author}
                  {t.cat_name ? (
                    <span className="ml-1 font-semibold text-ink-faint">
                      · {t.cat_name}
                    </span>
                  ) : null}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}

function TrustItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary-deep">
        {icon}
      </span>
      <div>
        <p className="text-[13.5px] font-bold">{title}</p>
        <p className="text-[12.5px] text-ink-soft">{desc}</p>
      </div>
    </div>
  );
}

function EvidenceChip({
  level,
  desc,
  fg,
  bg,
}: {
  level: string;
  desc: string;
  fg: string;
  bg: string;
}) {
  return (
    <div
      className="rounded-2xl border border-white/70 px-3.5 py-3"
      style={{ background: bg }}
    >
      <p className="text-[13px] font-extrabold" style={{ color: fg }}>
        근거 {level}
      </p>
      <p className="mt-1 text-[11.5px] leading-snug text-ink-soft">{desc}</p>
    </div>
  );
}
