import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getVets } from "@/lib/queries";
import { CatFace, FUR_NAMES } from "@/components/icons/CatArt";
import { Badge, Card, Rating, SectionHead } from "@/components/ui";
import { Book, ChevronRight, Clock, Shield } from "@/components/icons/Ico";
import { hashIndex, won } from "@/lib/format";

export const metadata: Metadata = {
  title: "전문 수의사 상담",
  description:
    "신장, 소화기, 피부, 응급, 영양. 질환별 전문 수의사에게 우리 아이 상황을 물어보세요.",
};

export const revalidate = 600;

const STEPS = [
  {
    title: "수의사 고르기",
    desc: "우리 아이 진단명과 가장 가까운 전문 분야를 보고 고릅니다.",
  },
  {
    title: "상황 적어 보내기",
    desc: "나이, 진단명, 지금 먹는 것, 걱정되는 점을 그대로 적어주세요.",
  },
  {
    title: "답변 받기",
    desc: "영업일 기준 1~2일 안에 정리된 답변을 보내드립니다.",
  },
];

export default async function VetsPage() {
  const vets = await getVets();

  return (
    <div>
      {/* 히어로 */}
      <section className="border-b border-line bg-gradient-to-b from-sky-soft/80 to-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <nav className="mb-5 flex items-center gap-1.5 text-[12.5px] text-ink-faint">
              <Link href="/" className="transition hover:text-primary">
                홈
              </Link>
              <span>/</span>
              <span className="font-semibold text-ink-soft">수의사 상담</span>
            </nav>

            <h1 className="text-[32px] font-extrabold leading-tight tracking-tight sm:text-[38px]">
              진료실에서
              <br />
              <span className="text-sky">못 다 물어본 것들</span>
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-soft">
              진료 시간은 짧고, 집에 오면 질문이 떠오릅니다. 질환별 전문
              수의사에게 우리 아이 상황을 차분히 적어 보내보세요. 급한 상황이라면
              온라인 상담보다{" "}
              <Link
                href="/clinics"
                className="font-bold text-primary underline underline-offset-2"
              >
                가까운 병원 방문
              </Link>
              이 먼저입니다.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {STEPS.map((s, i) => (
                <div
                  key={s.title}
                  className="rounded-2xl border border-line bg-surface px-4 py-4"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-sky-soft text-[12px] font-extrabold text-sky">
                    {i + 1}
                  </span>
                  <p className="mt-2.5 text-[13.5px] font-bold">{s.title}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto hidden max-w-[300px] lg:block">
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

      {/* 목록 */}
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead
          eyebrow={`${vets.length}명의 수의사`}
          title="어떤 분야가 필요하신가요"
          desc="각 수의사의 약력과 보호자 추천글을 보고 고르실 수 있습니다."
        />

        <div className="grid gap-5 lg:grid-cols-2">
          {vets.map((v) => (
            <Card key={v.slug} className="overflow-hidden">
              <div
                className="h-1.5 w-full"
                style={{ background: v.accent }}
              />
              <div className="p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <span
                    className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-3xl"
                    style={{ background: v.accent + "1C" }}
                  >
                    <CatFace
                      fur={FUR_NAMES[hashIndex(v.slug, FUR_NAMES.length)]}
                      mood="curious"
                      size={66}
                    />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[19px] font-extrabold">
                        {v.name} 수의사
                      </h3>
                      {v.consult_open ? (
                        <Badge fg="#4F7F4A" bg="#EDF4EC">
                          상담 가능
                        </Badge>
                      ) : (
                        <Badge>상담 마감</Badge>
                      )}
                    </div>
                    <p
                      className="mt-1 text-[13px] font-bold"
                      style={{ color: v.accent }}
                    >
                      {v.title}
                    </p>
                    <p className="mt-1 text-[12.5px] text-ink-faint">
                      {v.clinic_name}
                      {v.region ? ` · ${v.region}` : ""}
                    </p>
                  </div>
                </div>

                <p className="mt-5 rounded-2xl bg-cream-deep/50 px-4 py-3.5 text-[13.5px] font-semibold leading-relaxed">
                  {v.intro}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {v.specialties.map((s) => (
                    <Badge key={s} fg={v.accent} bg={v.accent + "18"}>
                      {s}
                    </Badge>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 border-y border-line py-4">
                  <Stat label="임상 경력" value={`${v.years}년`} />
                  <Stat label="상담 만족도" value={v.rating.toFixed(1)} />
                  <Stat label="상담료" value={won(v.consult_fee)} />
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <Rating value={v.rating} count={v.review_count} />
                  <Link
                    href={`/vets/${v.slug}`}
                    className="inline-flex items-center gap-1 rounded-full px-4 py-2.5 text-[13.5px] font-bold text-white transition hover:opacity-90"
                    style={{ background: v.accent }}
                  >
                    약력 보고 상담하기
                    <ChevronRight size={15} />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 안내 */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <NoticeCard
            icon={<Clock size={18} />}
            title="답변까지 1~2 영업일"
            desc="주말·공휴일에 남기신 상담은 다음 영업일부터 순서대로 답변드립니다."
          />
          <NoticeCard
            icon={<Book size={18} />}
            title="진단이 아닌 조언"
            desc="온라인 상담은 검사 없이 이루어지므로 진단을 대신할 수 없습니다."
          />
          <NoticeCard
            icon={<Shield size={18} />}
            title="응급은 병원으로"
            desc="호흡 곤란, 지속 구토, 배뇨 곤란은 즉시 병원에 가셔야 합니다."
          />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11.5px] text-ink-faint">{label}</p>
      <p className="mt-0.5 text-[15px] font-extrabold">{value}</p>
    </div>
  );
}

function NoticeCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-[22px] border border-line bg-surface p-5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary-deep">
        {icon}
      </span>
      <p className="mt-3 text-[14px] font-extrabold">{title}</p>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">{desc}</p>
    </div>
  );
}
