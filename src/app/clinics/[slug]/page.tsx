import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getClinic,
  getClinicVets,
  getClinics,
  getTestimonials,
} from "@/lib/queries";
import { CatFace, FUR_NAMES } from "@/components/icons/CatArt";
import { Badge, Card, Rating, SectionHead, btnGhost } from "@/components/ui";
import {
  Check,
  ChevronRight,
  Clock,
  External,
  Phone,
  Pin,
  Star,
} from "@/components/icons/Ico";
import { hashIndex } from "@/lib/format";

export const revalidate = 600;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const clinics = await getClinics();
  return clinics.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const clinic = await getClinic(slug);
  if (!clinic) return { title: "병원을 찾을 수 없습니다" };
  return {
    title: `${clinic.name} — ${clinic.region} ${clinic.district}`,
    description: clinic.intro,
  };
}

export default async function ClinicDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const clinic = await getClinic(slug);
  if (!clinic) notFound();

  const [vets, testimonials] = await Promise.all([
    getClinicVets(clinic.id),
    getTestimonials("clinic", clinic.id),
  ]);

  const hours = Object.entries(clinic.hours ?? {});

  return (
    <div>
      <section
        className="border-b border-line"
        style={{
          background: `linear-gradient(160deg, ${clinic.accent}1C 0%, var(--cream) 70%)`,
        }}
      >
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <nav className="mb-6 flex items-center gap-1.5 text-[12.5px] text-ink-faint">
            <Link href="/" className="transition hover:text-primary">
              홈
            </Link>
            <span>/</span>
            <Link href="/clinics" className="transition hover:text-primary">
              우리 동네 병원
            </Link>
            <span>/</span>
            <span className="font-semibold text-ink-soft">{clinic.name}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-1.5">
            <Badge fg={clinic.accent} bg={clinic.accent + "1A"}>
              {clinic.region} {clinic.district}
            </Badge>
            {clinic.night_care ? (
              <Badge fg="#C25F2C" bg="#FDEDE3">
                24시 응급
              </Badge>
            ) : null}
            {clinic.cat_friendly ? <Badge>캣 프렌들리</Badge> : null}
          </div>

          <h1 className="mt-3 text-[32px] font-extrabold tracking-tight sm:text-[36px]">
            {clinic.name}
          </h1>

          <div className="mt-3">
            <Rating value={clinic.rating} count={clinic.review_count} size={16} />
          </div>

          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            {clinic.intro}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {clinic.phone ? (
              <a
                href={`tel:${clinic.phone.replace(/-/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-bold text-white transition hover:opacity-90"
                style={{ background: clinic.accent }}
              >
                <Phone size={16} />
                {clinic.phone}
              </a>
            ) : null}
            {clinic.homepage ? (
              <a
                href={clinic.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className={btnGhost}
              >
                홈페이지
                <External size={15} />
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-12">
            {/* 진료 분야 */}
            <section>
              <SectionHead eyebrow="진료" title="이런 것들을 봅니다" />
              <div className="flex flex-wrap gap-2">
                {clinic.specialties.map((s) => (
                  <span
                    key={s}
                    className="rounded-2xl border border-line bg-surface px-4 py-2.5 text-[13.5px] font-bold"
                    style={{ color: clinic.accent }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>

            {/* 시설 */}
            {clinic.facilities.length > 0 ? (
              <section>
                <SectionHead eyebrow="시설 · 장비" title="갖추고 있는 것들" />
                <Card className="p-7">
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {clinic.facilities.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span
                          className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white"
                          style={{ background: clinic.accent }}
                        >
                          <Check size={12} strokeWidth={3} />
                        </span>
                        <span className="text-[13.5px] leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </section>
            ) : null}

            {/* 소속 수의사 */}
            {vets.length > 0 ? (
              <section>
                <SectionHead
                  eyebrow="의료진"
                  title="이 병원의 수의사"
                  desc="약력과 전문 분야를 확인하고 온라인 상담도 신청할 수 있습니다."
                />
                <div className="grid gap-3">
                  {vets.map((v) => (
                    <Link
                      key={v.slug}
                      href={`/vets/${v.slug}`}
                      className="group flex items-start gap-4 rounded-[22px] border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
                    >
                      <span
                        className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl"
                        style={{ background: v.accent + "1C" }}
                      >
                        <CatFace
                          fur={FUR_NAMES[hashIndex(v.slug, FUR_NAMES.length)]}
                          mood="curious"
                          size={58}
                        />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[16px] font-extrabold transition group-hover:text-primary">
                          {v.name} 수의사
                        </p>
                        <p
                          className="mt-0.5 text-[12.5px] font-bold"
                          style={{ color: v.accent }}
                        >
                          {v.title} · 경력 {v.years}년
                        </p>
                        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-soft">
                          {v.intro}
                        </p>
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {v.specialties.slice(0, 3).map((s) => (
                            <Badge key={s}>{s}</Badge>
                          ))}
                        </div>
                      </div>
                      <ChevronRight
                        size={18}
                        className="mt-1 shrink-0 text-ink-faint transition group-hover:translate-x-0.5 group-hover:text-primary"
                      />
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
                  title="다녀간 보호자들의 말"
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

          {/* 사이드 */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-[15px] font-extrabold">
                <Clock size={17} style={{ color: clinic.accent }} />
                진료 시간
              </h3>
              <dl className="mt-4 space-y-2.5">
                {hours.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-[13px] text-ink-soft">{k}</dt>
                    <dd className="text-[13px] font-bold">{v}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-[15px] font-extrabold">
                <Pin size={17} style={{ color: clinic.accent }} />
                찾아가는 길
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
                {clinic.address}
              </p>
              <a
                href={`https://map.naver.com/p/search/${encodeURIComponent(clinic.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={btnGhost + " mt-4 w-full"}
              >
                지도에서 찾기
                <External size={15} />
              </a>
            </Card>

            <div className="rounded-[22px] border border-line bg-cream-deep/50 p-5">
              <p className="text-[12px] leading-relaxed text-ink-soft">
                이 병원 정보는 학습·시연용 예시 데이터입니다. 실제 방문 전에는
                전화로 진료 시간과 예약 가능 여부를 꼭 확인해 주세요.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
