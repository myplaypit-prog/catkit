import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { getClinicRegions, getClinics } from "@/lib/queries";
import { ClinicSearch } from "@/components/ClinicSearch";
import { Badge, Card, Empty, Rating, btnPrimary } from "@/components/ui";
import { Clock, Phone, Pin } from "@/components/icons/Ico";

export const metadata: Metadata = {
  title: "우리 동네 동물병원",
  description:
    "고양이를 편하게 봐주는 병원, 야간 응급 병원, 피부·소화기 전문 병원을 지역별로 찾아보세요.",
};

export const revalidate = 600;

type SP = Promise<Record<string, string | string[] | undefined>>;

function one(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ClinicsPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;

  const [clinics, regions] = await Promise.all([
    getClinics({
      region: one(sp.region),
      q: one(sp.q),
      night: one(sp.night),
    }),
    getClinicRegions(),
  ]);

  return (
    <div>
      <section className="border-b border-line bg-gradient-to-b from-sage-soft/70 to-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <nav className="mb-5 flex items-center gap-1.5 text-[12.5px] text-ink-faint">
              <Link href="/" className="transition hover:text-primary">
                홈
              </Link>
              <span>/</span>
              <span className="font-semibold text-ink-soft">우리 동네 병원</span>
            </nav>

            <h1 className="text-[32px] font-extrabold leading-tight tracking-tight sm:text-[38px]">
              가까운 곳에
              <br />
              <span className="text-sage">믿을 만한 병원</span>이 있다는 것
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-soft">
              고양이를 이동장에서 꺼내지 않고 봐주는 병원, 새벽에도 문이 열려
              있는 병원, 피부만 보는 병원. 우리 아이에게 지금 필요한 곳을
              찾아보세요.
            </p>

            <div className="mt-8">
              <Suspense fallback={null}>
                <ClinicSearch regions={regions} />
              </Suspense>
            </div>
          </div>

          <div className="relative mx-auto hidden max-w-[280px] lg:block">
            <Image
              src="/illustrations/cat-cream.png"
              alt="크림색 고양이 일러스트"
              width={512}
              height={512}
              className="animate-floaty w-full drop-shadow-[0_18px_28px_rgba(122,88,60,0.14)]"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="mb-5 text-[13.5px] font-semibold text-ink-soft">
          총 <b className="font-extrabold text-ink">{clinics.length}</b>곳
        </p>

        {clinics.length === 0 ? (
          <Empty
            title="조건에 맞는 병원이 없어요"
            desc="지역을 넓히거나 검색어를 지워보세요."
            action={
              <Link href="/clinics" className={btnPrimary}>
                전체 병원 보기
              </Link>
            }
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {clinics.map((c) => (
              <Card key={c.slug} className="overflow-hidden">
                <div className="h-1.5 w-full" style={{ background: c.accent }} />
                <Link href={`/clinics/${c.slug}`} className="block p-6 sm:p-7">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge fg={c.accent} bg={c.accent + "18"}>
                      {c.region} {c.district}
                    </Badge>
                    {c.night_care ? (
                      <Badge fg="#C25F2C" bg="#FDEDE3">
                        24시 응급
                      </Badge>
                    ) : null}
                    {c.cat_friendly ? <Badge>캣 프렌들리</Badge> : null}
                  </div>

                  <h2 className="mt-3 text-[20px] font-extrabold">{c.name}</h2>
                  <p className="mt-2.5 line-clamp-3 text-[13.5px] leading-relaxed text-ink-soft">
                    {c.intro}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {c.specialties.map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </div>

                  <div className="mt-5 space-y-1.5 border-t border-line pt-4 text-[12.5px] text-ink-soft">
                    <p className="flex items-start gap-1.5">
                      <Pin size={14} className="mt-0.5 shrink-0 text-ink-faint" />
                      {c.address}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock size={14} className="shrink-0 text-ink-faint" />
                      평일 {c.hours["평일"] ?? "문의"}
                      {c.hours["토요일"] ? ` · 토 ${c.hours["토요일"]}` : ""}
                    </p>
                    {c.phone ? (
                      <p className="flex items-center gap-1.5">
                        <Phone size={14} className="shrink-0 text-ink-faint" />
                        {c.phone}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <Rating value={c.rating} count={c.review_count} />
                    <span className="text-[13px] font-bold text-primary">
                      소개 보기
                    </span>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}

        <p className="mt-10 rounded-[20px] border border-line bg-surface px-6 py-5 text-[12.5px] leading-relaxed text-ink-soft">
          여기 실린 병원 정보는 학습·시연을 위한 예시 데이터입니다. 실제 병원을
          찾으실 때는 지도 서비스나{" "}
          <span className="font-semibold text-ink">
            농림축산식품부 동물보호관리시스템
          </span>
          의 등록 동물병원 정보를 확인해 주세요.
        </p>
      </div>
    </div>
  );
}
