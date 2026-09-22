import Image from "next/image";

/**
 * 히어로 비주얼 — 만물마켓의 PNG 고양이를 중심에 두고,
 * 그 톤에 맞춰 그린 SVG 소품(밥그릇 · 캡슐 · 잎 · 하트)을 둘러 배치했습니다.
 */
export function HeroArt() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[400px]">
      {/* 뒤쪽 블롭 */}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hero-blob" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDEDE3" />
            <stop offset="55%" stopColor="#FBF1E1" />
            <stop offset="100%" stopColor="#EDF4EC" />
          </linearGradient>
          <linearGradient id="hero-bowl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F6DCC6" />
          </linearGradient>
        </defs>

        <path
          d="M204 22c58 0 112 23 140 72s21 112-14 155-95 66-148 57-99-46-120-95S45 96 92 57 146 22 204 22Z"
          fill="url(#hero-blob)"
        />

        {/* 점 패턴 */}
        <g fill="#E07A46" opacity="0.13">
          {[
            [70, 118],
            [58, 172],
            [86, 224],
            [330, 128],
            [344, 182],
            [316, 236],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="4" />
          ))}
        </g>

        {/* 밥그릇 */}
        <g transform="translate(232 276)">
          <ellipse cx="42" cy="56" rx="50" ry="7" fill="#E07A46" opacity="0.12" />
          <path
            d="M4 20h76a6 6 0 0 1 6 6c0 16-14 28-32 28H30C12 54-2 42-2 26a6 6 0 0 1 6-6Z"
            fill="url(#hero-bowl)"
            stroke="#E4B893"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <ellipse cx="42" cy="20" rx="44" ry="10" fill="#FFF6EA" stroke="#E4B893" strokeWidth="3.5" />
          {/* 사료 알갱이 */}
          <g fill="#D99338">
            <circle cx="28" cy="18" r="5" />
            <circle cx="42" cy="13" r="5.5" opacity="0.85" />
            <circle cx="56" cy="19" r="4.6" opacity="0.7" />
            <circle cx="36" cy="24" r="4" opacity="0.6" />
            <circle cx="50" cy="25" r="4.4" opacity="0.75" />
          </g>
        </g>

        {/* 캡슐 */}
        <g transform="translate(58 244) rotate(-22)">
          <rect x="0" y="0" width="58" height="26" rx="13" fill="#FFFFFF" stroke="#7FA9C9" strokeWidth="3.4" />
          <path d="M29 0h16a13 13 0 0 1 13 13 13 13 0 0 1-13 13H29Z" fill="#CFE2EF" />
        </g>

        {/* 잎 */}
        <g transform="translate(288 74)">
          <path
            d="M46 0c3 26-9 43-29 43-8 0-14-2-18-6C-9 28-2 7 18 2c9-2 20-1 28-2Z"
            fill="#CFE0CB"
            stroke="#8FB089"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path d="M2 52C6 38 16 25 31 16" fill="none" stroke="#8FB089" strokeWidth="3.2" strokeLinecap="round" />
        </g>

        {/* 하트 */}
        <g transform="translate(70 76)">
          <path
            d="M24 42C8 31 0 24 0 15A11 11 0 0 1 24 8 11 11 0 0 1 48 15c0 9-8 16-24 27Z"
            fill="#F2C7BC"
          />
        </g>

        {/* 발자국 */}
        <g transform="translate(316 292)" fill="#E07A46" opacity="0.28">
          <ellipse cx="6" cy="8" rx="4" ry="5.4" />
          <ellipse cx="17" cy="4" rx="4" ry="5.6" />
          <ellipse cx="28" cy="9" rx="4" ry="5.4" />
          <path d="M17 15c7 0 12 4.8 12 10.2 0 4.6-3.6 7.6-8.4 7.6-2 0-3-.6-3.6-.6s-1.6.6-3.6.6C8.6 32.8 5 29.8 5 25.2 5 19.8 10 15 17 15Z" />
        </g>
      </svg>

      {/* PNG 고양이 */}
      <Image
        src="/illustrations/cat-orange.png"
        alt="주황색 줄무늬 고양이 일러스트"
        width={512}
        height={512}
        priority
        className="animate-floaty absolute left-1/2 top-[14%] w-[64%] -translate-x-1/2 drop-shadow-[0_18px_28px_rgba(122,88,60,0.16)]"
      />
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
