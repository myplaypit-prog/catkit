import Image from "next/image";

export function HeroArtNew() {
  return <div className="relative mx-auto w-full max-w-[620px] overflow-hidden rounded-[2rem] border border-white/70 bg-[#E8DDD0] shadow-[0_28px_70px_-34px_rgba(65,52,41,.48)] sm:rounded-[2.6rem]">
    <div className="relative aspect-[4/3]"><Image src="/illustrations/catkit-hero.png" alt="건강한 크림 진저 고양이와 사료를 담은 캣킷 메인 이미지" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div>
    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-sm backdrop-blur sm:bottom-6 sm:left-6 sm:right-auto sm:min-w-[250px]"><div><p className="text-[11px] font-bold tracking-[.12em] text-primary">CATKIT STANDARD</p><p className="mt-0.5 text-[13px] font-bold text-ink">근거 · 성분 · 급여 목적 검토</p></div><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sage text-white" aria-hidden="true">✓</span></div>
  </div>;
}
