import type { CSSProperties } from "react";

/* ══════════════════════════════════════════════════════════
   catkit 고양이 일러스트 세트
   만물마켓의 부드러운 파스텔 고양이 톤을 벡터로 옮긴 것.
   둥근 실루엣 · 볼터치 · 감은 눈의 미소를 공통 문법으로 씁니다.
   ══════════════════════════════════════════════════════════ */

export type FurName = "cream" | "orange" | "calico" | "tabby" | "grey";

type Fur = {
  base: string;
  shade: string;
  light: string;
  ear: string;
  patch: string | null;
};

export const FURS: Record<FurName, Fur> = {
  cream: {
    base: "#F7E7D2",
    shade: "#EBD5B9",
    light: "#FFF6EA",
    ear: "#F3BFAE",
    patch: null,
  },
  orange: {
    base: "#F3B575",
    shade: "#E29A55",
    light: "#FBDCBA",
    ear: "#F0A793",
    patch: "#E58F49",
  },
  calico: {
    base: "#F6E3CE",
    shade: "#E6CDB2",
    light: "#FFF7EC",
    ear: "#F2BCAA",
    patch: "#D99338",
  },
  tabby: {
    base: "#B99573",
    shade: "#8A6A50",
    light: "#D9C2A8",
    ear: "#EDBDB0",
    patch: "#6F513E",
  },
  grey: {
    base: "#DCD5CE",
    shade: "#C6BDB4",
    light: "#F0EBE6",
    ear: "#EFC0B2",
    patch: "#A99C90",
  },
};

export const FUR_NAMES: FurName[] = ["cream", "orange", "calico", "tabby", "grey"];

type FaceProps = {
  fur?: FurName;
  /** happy = 감은 눈 / curious = 동그란 눈 / sleepy = 반쯤 감은 눈 */
  mood?: "happy" | "curious" | "sleepy";
  size?: number | string;
  className?: string;
  style?: CSSProperties;
  title?: string;
};

/** 동그란 고양이 얼굴 — 아바타, 카드 썸네일, 리스트 등 어디에나 */
export function CatFace({
  fur = "cream",
  mood = "happy",
  size = 96,
  className,
  style,
  title,
}: FaceProps) {
  const f = FURS[fur];
  const uid = `cf-${fur}-${mood}`;

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      style={style}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <radialGradient id={`${uid}-g`} cx="38%" cy="28%" r="78%">
          <stop offset="0%" stopColor={f.light} />
          <stop offset="62%" stopColor={f.base} />
          <stop offset="100%" stopColor={f.shade} />
        </radialGradient>
        <clipPath id={`${uid}-clip`}>
          <path d="M60 22c19 0 33 14 33 33 0 20-14 36-33 36S27 75 27 55c0-19 14-33 33-33Z" />
        </clipPath>
      </defs>

      {/* 귀 */}
      <g strokeLinejoin="round" strokeWidth="7">
        <path d="M34 42 30 17l24 11Z" fill={f.base} stroke={f.base} />
        <path d="M86 42 90 17 66 28Z" fill={f.base} stroke={f.base} />
        <path d="M37 39 35 25l13 6Z" fill={f.ear} stroke={f.ear} strokeWidth="4" />
        <path d="M83 39 85 25l-13 6Z" fill={f.ear} stroke={f.ear} strokeWidth="4" />
      </g>

      {/* 얼굴 */}
      <path
        d="M60 22c19 0 33 14 33 33 0 20-14 36-33 36S27 75 27 55c0-19 14-33 33-33Z"
        fill={`url(#${uid}-g)`}
      />

      {/* 무늬 */}
      {f.patch ? (
        <g clipPath={`url(#${uid}-clip)`} opacity="0.72">
          <path d="M27 22h20c-6 9-9 20-8 32-4 6-10 9-16 9V22Z" fill={f.patch} />
          <path d="M62 18h18l4 12-15 6-9-8Z" fill={f.patch} opacity="0.55" />
        </g>
      ) : null}

      {/* 볼터치 */}
      <ellipse cx="41" cy="63" rx="7.5" ry="5" fill="#F3A793" opacity="0.42" />
      <ellipse cx="79" cy="63" rx="7.5" ry="5" fill="#F3A793" opacity="0.42" />

      {/* 눈 */}
      {mood === "happy" ? (
        <g
          fill="none"
          stroke="#4A382C"
          strokeWidth="4.2"
          strokeLinecap="round"
        >
          <path d="M42 56q5-6 10 0" />
          <path d="M68 56q5-6 10 0" />
        </g>
      ) : mood === "sleepy" ? (
        <g fill="none" stroke="#4A382C" strokeWidth="4.2" strokeLinecap="round">
          <path d="M42 57q5 4 10 0" />
          <path d="M68 57q5 4 10 0" />
        </g>
      ) : (
        <g>
          <ellipse cx="47" cy="55" rx="6.2" ry="7" fill="#4A382C" />
          <ellipse cx="73" cy="55" rx="6.2" ry="7" fill="#4A382C" />
          <circle cx="49.2" cy="52.4" r="2.1" fill="#FFFFFF" opacity="0.92" />
          <circle cx="75.2" cy="52.4" r="2.1" fill="#FFFFFF" opacity="0.92" />
        </g>
      )}

      {/* 코 · 입 */}
      <path d="M60 66.5 56.4 63h7.2Z" fill="#E08E7E" />
      <path
        d="M60 67v2.6M60 69.6q-3.4 3-6.2 0M60 69.6q3.4 3 6.2 0"
        fill="none"
        stroke="#4A382C"
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* 수염 */}
      <g stroke="#B69A82" strokeWidth="1.8" strokeLinecap="round" opacity="0.55">
        <path d="M32 60h-11M32 66l-10 3" />
        <path d="M88 60h11M88 66l10 3" />
      </g>
    </svg>
  );
}

/** 로고 마크 — 고양이 머리 + 하트 */
export function CatMark({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="12" fill="#465747" />
      <path d="M10.5 18.3 9.3 9.2l8.3 4.1h4.8l8.3-4.1-1.2 9.1" fill="none" stroke="#FCF8F1" strokeWidth="3.1" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M9.8 18c0 8.5 4.5 13.1 10.2 15 5.7-1.9 10.2-6.5 10.2-15" fill="none" stroke="#FCF8F1" strokeWidth="3.1" strokeLinecap="round" />
      <path d="M20 29.2c-3.1-2.1-5-4-5-6.2a2.8 2.8 0 0 1 5-1.7 2.8 2.8 0 0 1 5 1.7c0 2.2-1.9 4.1-5 6.2Z" fill="#E9BBA8" />
    </svg>
  );
}

/* ── 질환 카테고리 아이콘 ──────────────────────────────── */

type IconProps = { size?: number; className?: string; color?: string };

function iconBase(size: number | undefined, className: string | undefined) {
  return {
    viewBox: "0 0 24 24",
    width: size ?? 22,
    height: size ?? 22,
    className,
    "aria-hidden": true as const,
  };
}

export function KidneyIcon({ size, className, color = "currentColor" }: IconProps) {
  return (
    <svg {...iconBase(size, className)} fill="none">
      <path
        d="M9.2 3.4c2.6 0 4.1 1.9 4.1 4.3 0 1.5-.7 2.5-.7 4.3s.7 2.8.7 4.3c0 2.4-1.5 4.3-4.1 4.3C5.7 20.6 3 17 3 12s2.7-8.6 6.2-8.6Z"
        fill={color}
        opacity="0.28"
      />
      <path
        d="M9.2 3.4c2.6 0 4.1 1.9 4.1 4.3 0 1.5-.7 2.5-.7 4.3s.7 2.8.7 4.3c0 2.4-1.5 4.3-4.1 4.3C5.7 20.6 3 17 3 12s2.7-8.6 6.2-8.6Z"
        stroke={color}
        strokeWidth="1.6"
      />
      <path d="M12.9 12H21" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="20.4" cy="12" r="1.7" fill={color} />
    </svg>
  );
}

export function FlaskIcon({ size, className, color = "currentColor" }: IconProps) {
  return (
    <svg {...iconBase(size, className)} fill="none">
      <path d="M10 2.8v6.1L4.7 18a2.4 2.4 0 0 0 2.1 3.6h10.4a2.4 2.4 0 0 0 2.1-3.6L14 8.9V2.8"
        fill={color} opacity="0.22" />
      <path d="M10 2.8v6.1L4.7 18a2.4 2.4 0 0 0 2.1 3.6h10.4a2.4 2.4 0 0 0 2.1-3.6L14 8.9V2.8"
        stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8.6 2.8h6.8" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7.2 14.6h9.6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function LeafIcon({ size, className, color = "currentColor" }: IconProps) {
  return (
    <svg {...iconBase(size, className)} fill="none">
      <path
        d="M20.4 3.6c.8 8.4-3 14.2-9.6 14.2-2.4 0-4.2-.7-5.4-1.9C2.8 13.3 4.6 6.4 11 4.7c2.9-.8 6.5-.8 9.4-1.1Z"
        fill={color}
        opacity="0.26"
      />
      <path
        d="M20.4 3.6c.8 8.4-3 14.2-9.6 14.2-2.4 0-4.2-.7-5.4-1.9C2.8 13.3 4.6 6.4 11 4.7c2.9-.8 6.5-.8 9.4-1.1Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M3.6 21c1.4-4.6 4.6-8.8 9.4-11.7" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ShieldIcon({ size, className, color = "currentColor" }: IconProps) {
  return (
    <svg {...iconBase(size, className)} fill="none">
      <path d="M12 2.6 4.4 5.7v6c0 4.7 3.1 8.5 7.6 9.7 4.5-1.2 7.6-5 7.6-9.7v-6L12 2.6Z"
        fill={color} opacity="0.24" />
      <path d="M12 2.6 4.4 5.7v6c0 4.7 3.1 8.5 7.6 9.7 4.5-1.2 7.6-5 7.6-9.7v-6L12 2.6Z"
        stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m8.6 11.8 2.4 2.4 4.4-4.4" stroke={color} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HeartIcon({ size, className, color = "currentColor" }: IconProps) {
  return (
    <svg {...iconBase(size, className)} fill="none">
      <path
        d="M12 20.4C6.6 16.9 3.4 13.9 3.4 10.3A4.7 4.7 0 0 1 12 7.6a4.7 4.7 0 0 1 8.6 2.7c0 3.6-3.2 6.6-8.6 10.1Z"
        fill={color}
        opacity="0.26"
      />
      <path
        d="M12 20.4C6.6 16.9 3.4 13.9 3.4 10.3A4.7 4.7 0 0 1 12 7.6a4.7 4.7 0 0 1 8.6 2.7c0 3.6-3.2 6.6-8.6 10.1Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PawIcon({ size, className, color = "currentColor" }: IconProps) {
  return (
    <svg {...iconBase(size, className)} fill={color}>
      <ellipse cx="7" cy="8.4" rx="2.3" ry="3" opacity="0.75" />
      <ellipse cx="12" cy="6.6" rx="2.3" ry="3.2" opacity="0.75" />
      <ellipse cx="17" cy="8.4" rx="2.3" ry="3" opacity="0.75" />
      <path d="M12 11.4c3.4 0 5.9 2.3 5.9 4.9 0 2.2-1.7 3.7-4 3.7-1 0-1.5-.3-1.9-.3s-.9.3-1.9.3c-2.3 0-4-1.5-4-3.7 0-2.6 2.5-4.9 5.9-4.9Z" />
    </svg>
  );
}

const ICONS: Record<string, (p: IconProps) => React.ReactElement> = {
  kidney: KidneyIcon,
  flask: FlaskIcon,
  leaf: LeafIcon,
  shield: ShieldIcon,
  heart: HeartIcon,
  paw: PawIcon,
};

export function CategoryIcon({
  name,
  size,
  className,
  color,
}: IconProps & { name: string }) {
  const Cmp = ICONS[name] ?? PawIcon;
  return <Cmp size={size} className={className} color={color} />;
}
