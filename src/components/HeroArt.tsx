import Image from "next/image";

const HERO_SRC = "/illustrations/catkit-hero.png";
const HERO_BG = "#F3EBDF"; /* = --hero */

/**
 * 홈 키비주얼.
 * 액자형 카드를 없애고 사진을 섹션 배경으로 흘려보냅니다.
 * 사진 왼쪽 여백이 원래 크림 톤이라, 같은 색 그라데이션을 덮으면
 * 이미지 경계가 사라지고 배경과 한 덩어리로 읽힙니다.
 */

/** 데스크톱 — 오른쪽 화면 끝까지 풀블리드, 왼쪽은 배경색으로 소멸 */
export function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[66%] select-none lg:block xl:w-[62%]"
    >
      <Image
        src={HERO_SRC}
        alt=""
        fill
        priority
        sizes="66vw"
        className="object-cover object-[64%_45%]"
      />
      {/* 왼쪽으로 갈수록 배경색에 잠기게 — 세로 경계선이 생기지 않도록 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${HERO_BG} 0%, rgba(243,235,223,.88) 22%, rgba(243,235,223,.35) 44%, rgba(243,235,223,0) 62%)`,
        }}
      />
      {/* 위아래도 살짝 물려서 사각 프레임이 보이지 않게 */}
      <div
        className="absolute inset-x-0 top-0 h-20"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${HERO_BG} 0%, rgba(243,235,223,0) 100%)`,
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-24"
        style={{
          backgroundImage: `linear-gradient(to top, ${HERO_BG} 0%, rgba(243,235,223,0) 100%)`,
        }}
      />
      <StandardPill className="absolute bottom-8 right-8" />
    </div>
  );
}

/**
 * 모바일·태블릿 — 카피 아래로 가장자리까지 꽉 찬 밴드.
 *
 * 높이는 반드시 비율로 잡습니다. 고정 높이(h-[270px] 등)로 두면 폭이 넓어질수록
 * 박스 비율만 커져서 원본(4:3)이 세로로 깎입니다. 820px에서 세로의 45%가
 * 날아가 고양이 귀가 통째로 잘렸습니다. 3:2로 고정하면 어느 폭에서든
 * 잘리는 양이 11%로 일정합니다.
 */
export function HeroImageMobile() {
  return (
    <div className="relative aspect-[3/2] w-full lg:hidden">
      <Image
        src={HERO_SRC}
        alt="사료 봉투와 밥그릇 옆에 앉은 크림 진저 고양이"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[66%_42%]"
      />
      <div
        className="absolute inset-x-0 top-0 h-24"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${HERO_BG} 0%, rgba(243,235,223,0) 100%)`,
        }}
      />
      <StandardPill className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6" />
    </div>
  );
}

/** 사진 위에 얹는 얇은 글래스 칩 — 예전의 흰 카드를 대신합니다 */
function StandardPill({ className = "" }: { className?: string }) {
  return (
    <span
      className={
        "inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/85 py-2 pl-2 pr-4 text-[12px] font-bold text-ink shadow-[0_10px_28px_-16px_rgba(72,53,39,.55)] backdrop-blur " +
        className
      }
    >
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sage text-[12px] text-white">
        ✓
      </span>
      무병장수 기준 · 근거 · 성분 · 급여 목적 검토
    </span>
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
