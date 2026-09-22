import Image from "next/image";

/** 홈 히어로 — 메인 고양이 이미지 + 캣킷 기준 배지 */
export function HeroArt() {
  return (
    <div className="relative mx-auto w-full max-w-[620px] overflow-hidden rounded-[2rem] border border-white/70 bg-[#E8DDD0] shadow-[0_28px_70px_-34px_rgba(65,52,41,.48)] sm:rounded-[2.6rem]">
      <div className="relative aspect-[4/3]">
        <Image
          src="/illustrations/catkit-hero.png"
          alt="건강한 크림 진저 고양이와 사료를 담은 캣킷 메인 이미지"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-sm backdrop-blur sm:bottom-6 sm:left-6 sm:right-auto sm:min-w-[250px]">
        <div>
          <p className="text-[11px] font-bold tracking-[.12em] text-primary">
            CATKIT STANDARD
          </p>
          <p className="mt-0.5 text-[13px] font-bold text-ink">
            근거 · 성분 · 급여 목적 검토
          </p>
        </div>
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sage text-white"
          aria-hidden="true"
        >
          ✓
        </span>
      </div>
    </div>
  );
}

/** 작은 고양이 얼굴 3개가 겹쳐 있는 스트립 (후기 · 신뢰 표시용) */
export function CatFaceStack({ size = 34 }: { size?: number }) {
  const cats = ["cat-cream", "cat-calico", "cat-orange"];
  return (
    <div className="flex items-center -space-x-2.5">
      {cats.map((c) => (
        <span
          key={c}
          className="overflow-hidden rounded-full border-2 border-surface bg-cream-deep"
          style={{ width: size, height: size }}
        >
          <Image
            src={`/illustrations/${c}.png`}
            alt=""
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        </span>
      ))}
    </div>
  );
}
