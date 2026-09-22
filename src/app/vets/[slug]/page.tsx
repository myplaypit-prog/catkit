import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategories,
  getTestimonials,
  getVet,
  getVetClinics,
  getVets,
} from "@/lib/queries";
import { ConsultForm } from "@/components/ConsultForm";
import { CatFace, FUR_NAMES } from "@/components/icons/CatArt";
import { Badge, Card, Rating, SectionHead } from "@/components/ui";
import { Check, Pin, Star } from "@/components/icons/Ico";
import { hashIndex, won } from "@/lib/format";

export const revalidate = 600;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const vets = await getVets();
  return vets.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const vet = await getVet(slug);
  if (!vet) return { title: "수의사를 찾을 수 없습니다" };
  return {
    title: `${vet.name} 수의사 — ${vet.title}`,
    description: vet.intro,
  };
}

export default async function VetDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const vet = await getVet(slug);
  if (!vet) notFound();

  const [testimonials, clinics, categories] = await Promise.all([
    getTestimonials("vet", vet.id),
    getVetClinics(vet.id),
    getCategories(),
  ]);

  return (
    <div>
      {/* 헤더 */}
      <section
        className="border-b border-line"
        style={{
          background: `linear-gradient(160deg, ${vet.accent}1C 0%, var(--cream) 70%)`,
        }}
      >
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <nav className="mb-6 flex items-center gap-1.5 text-[12.5px] text-ink-faint">
            <Link href="/" className="transition hover:text-primary">
              홈
            </Link>
            <span>/</span>
            <Link href="/vets" className="transition hover:text-primary">
              수의사 상담
            </Link>
            <span>/</span>
            <span className="font-semibold text-ink-soft">{vet.name}</span>
          </nav>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <span
              className="grid h-[104px] w-[104px] shrink-0 place-items-center rounded-[28px] bg-surface shadow-[var(--shadow-soft)]"
              style={{ background: vet.accent + "22" }}
            >
              <CatFace
                fur={FUR_NAMES[hashIndex(vet.slug, FUR_NAMES.length)]}
                mood="curious"
                size={96}
              />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[30px] font-extrabold tracking-tight">
                  {vet.name} 수의사
                </h1>
                {vet.consult_open ? (
                  <Badge fg="#4F7F4A" bg="#EDF4EC">
                    상담 가능
                  </Badge>
                ) : (
                  <Badge>상담 마감</Badge>
                )}
              </div>

              <p
                className="mt-1.5 text-[15px] font-bold"
                style={{ color: vet.accent }}
              >
                {vet.title}
              </p>
              <p className="mt-1 text-[13.5px] text-ink-soft">
                {vet.clinic_name}
                {vet.region ? ` · ${vet.region}` : ""}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                <Rating value={vet.rating} count={vet.review_count} size={16} />
                <span className="text-[13px] font-bold text-ink-soft">
                  임상 경력 {vet.years}년
                </span>
                <span className="text-[13px] font-bold text-ink-soft">
                  상담료 {vet.consult_fee === 0 ? "무료" : won(vet.consult_fee)}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {vet.specialties.map((s) => (
                  <Badge key={s} fg={vet.accent} bg={vet.accent + "1A"}>
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <blockquote
            className="mt-8 rounded-[22px] border-l-4 bg-surface px-6 py-5 text-[15.5px] font-semibold leading-relaxed"
            style={{ borderColor: vet.accent }}
          >
            {vet.intro}
          </blockquote>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          <div className="space-y-12">
            {/* 소개글 */}
            <section>
              <SectionHead eyebrow="소개" title="어떤 진료를 하나요" />
              <Card className="p-7">
                <div className="prose-warm text-[14.5px]">
                  {vet.bio.split("\n").map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </Card>
            </section>

            {/* 약력 */}
            {vet.career.length > 0 ? (
              <section>
                <SectionHead eyebrow="약력" title="걸어온 길" />
                <Card className="p-7">
                  <ol className="relative space-y-6 border-l-2 border-line pl-6">
                    {vet.career.map((c, i) => (
                      <li key={`${c.year}-${i}`} className="relative">
                        <span
                          className="absolute -left-[31px] top-1 grid h-4 w-4 place-items-center rounded-full border-2 border-surface"
                          style={{ background: vet.accent }}
                        />
                        <p
                          className="text-[12.5px] font-extrabold"
                          style={{ color: vet.accent }}
                        >
                          {c.year}
                        </p>
                        <p className="mt-0.5 text-[14px] font-semibold leading-relaxed">
                          {c.desc}
                        </p>
                      </li>
                    ))}
                  </ol>
                </Card>
              </section>
            ) : null}

            {/* 학력 */}
            {vet.education.length > 0 ? (
              <section>
                <SectionHead eyebrow="학력 · 수련" title="배움의 기록" />
                <Card className="p-7">
                  <ul className="space-y-3">
                    {vet.education.map((e) => (
                      <li key={e} className="flex items-start gap-2.5">
                        <span
                          className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white"
                          style={{ background: vet.accent }}
                        >
                          <Check size={12} strokeWidth={3} />
                        </span>
                        <span className="text-[14px] leading-relaxed">{e}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </section>
            ) : null}

            {/* 소속 병원 */}
            {clinics.length > 0 ? (
              <section>
                <SectionHead eyebrow="소속" title="진료하는 병원" />
                <div className="grid gap-3">
                  {clinics.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/clinics/${c.slug}`}
                      className="group flex items-start gap-3 rounded-[22px] border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
                    >
                      <span
                        className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                        style={{ background: c.accent + "1A", color: c.accent }}
                      >
                        <Pin size={18} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[15px] font-extrabold transition group-hover:text-primary">
                          {c.name}
                        </p>
                        <p className="mt-0.5 text-[12.5px] text-ink-soft">
                          {c.address}
                        </p>
                        <p className="mt-1.5 text-[12.5px] text-ink-faint">
                          평일 {c.hours["평일"] ?? "문의"}
                          {c.phone ? ` · ${c.phone}` : ""}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {/* 추천글 */}
            {testimonials.length > 0 ? (
              <section>
                <SectionHead
                  eyebrow={`추천글 ${testimonials.length}건`}
                  title="보호자들이 남긴 말"
                />
                <div className="grid gap-3">
                  {testimonials.map((t) => (
                    <Card key={t.id} className="p-6">
                      <div className="flex items-center gap-0.5 text-honey">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} size={14} />
                        ))}
                      </div>
                      <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
                        {t.body}
                      </p>
                      <div className="mt-4 flex items-center gap-2.5 border-t border-line pt-4">
                        <CatFace
                          fur={FUR_NAMES[hashIndex(t.author, FUR_NAMES.length)]}
                          size={32}
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
            ) : null}
          </div>

          {/* 상담 폼 */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ConsultForm vet={vet} categories={categories} />
          </aside>
        </div>
      </div>
    </div>
  );
}
