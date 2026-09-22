import { hashIndex } from "@/lib/format";
import { CatFace, FUR_NAMES } from "./icons/CatArt";
import type { ProductKind } from "@/lib/types";

/**
 * 실제 제품 사진 대신 쓰는 일러스트 썸네일.
 * 제형(건사료 / 습식 / 영양제)에 따라 패키지 모양이 달라지고,
 * 카테고리 색을 그대로 입어 목록에서 질환별로 한눈에 구분됩니다.
 */
export function ProductThumb({
  kind,
  accent = "#E07A46",
  seed,
  className = "",
  compact = false,
}: {
  kind: ProductKind;
  accent?: string | null;
  seed: string;
  className?: string;
  compact?: boolean;
}) {
  const color = accent ?? "#E07A46";
  const fur = FUR_NAMES[hashIndex(seed, FUR_NAMES.length)];
  const uid = "pt-" + seed.replace(/[^a-zA-Z0-9]/g, "");

  return (
    <div
      className={"relative overflow-hidden " + className}
      style={{
        background: `linear-gradient(155deg, ${color}1F 0%, ${color}0A 58%, #FFFFFF 100%)`,
      }}
    >
      {/* 배경 점무늬 */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern id={uid + "-dots"} width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="1.6" fill={color} opacity="0.16" />
          </pattern>
        </defs>
        <rect width="200" height="200" fill={`url(#${uid}-dots)`} />
      </svg>

      <svg
        viewBox="0 0 200 200"
        className="relative h-full w-full"
        aria-hidden="true"
      >
        <ellipse cx="100" cy="166" rx="56" ry="8" fill={color} opacity="0.13" />
        {kind === "dry" ? <BagArt color={color} uid={uid} /> : null}
        {kind === "wet" ? <PouchArt color={color} uid={uid} /> : null}
        {kind === "supplement" ? <BottleArt color={color} uid={uid} /> : null}
      </svg>

      {!compact ? (
        <CatFace
          fur={fur}
          mood="happy"
          size={64}
          className="absolute bottom-1 right-1 drop-shadow-sm"
        />
      ) : null}
    </div>
  );
}

function BagArt({ color, uid }: { color: string; uid: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={uid + "-bag"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor={color} stopOpacity="0.22" />
        </linearGradient>
      </defs>
      {/* 봉투 몸통 */}
      <path
        d="M62 62h76a8 8 0 0 1 8 8v82a10 10 0 0 1-10 10H64a10 10 0 0 1-10-10V70a8 8 0 0 1 8-8Z"
        fill={`url(#${uid}-bag)`}
        stroke={color}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* 접힌 윗면 */}
      <path
        d="M62 62c0-10 8-16 38-16s38 6 38 16"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M78 46q22-9 44 0" fill="none" stroke={color} strokeWidth="3.4" opacity="0.5" strokeLinecap="round" />
      {/* 라벨 */}
      <rect x="70" y="86" width="60" height="42" rx="10" fill={color} opacity="0.2" />
      <rect x="80" y="98" width="40" height="5" rx="2.5" fill={color} opacity="0.55" />
      <rect x="80" y="110" width="26" height="5" rx="2.5" fill={color} opacity="0.35" />
    </g>
  );
}

function PouchArt({ color, uid }: { color: string; uid: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={uid + "-po"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor={color} stopOpacity="0.24" />
        </linearGradient>
      </defs>
      {/* 파우치 */}
      <path
        d="M54 60h92v82a14 14 0 0 1-14 14H68a14 14 0 0 1-14-14V60Z"
        fill={`url(#${uid}-po)`}
        stroke={color}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* 실링 지그재그 */}
      <path
        d="M52 60h96M52 52l8 8-8 8M68 52l8 8-8 8M84 52l8 8-8 8M100 52l8 8-8 8M116 52l8 8-8 8M132 52l8 8-8 8"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />
      <rect x="70" y="84" width="60" height="38" rx="9" fill={color} opacity="0.2" />
      <rect x="80" y="96" width="40" height="5" rx="2.5" fill={color} opacity="0.55" />
      <rect x="80" y="107" width="24" height="5" rx="2.5" fill={color} opacity="0.35" />
      {/* 국물 물방울 */}
      <circle cx="146" cy="88" r="7" fill={color} opacity="0.25" />
      <circle cx="156" cy="104" r="4.5" fill={color} opacity="0.18" />
    </g>
  );
}

function BottleArt({ color, uid }: { color: string; uid: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={uid + "-bo"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor={color} stopOpacity="0.24" />
        </linearGradient>
      </defs>
      {/* 뚜껑 */}
      <rect x="80" y="38" width="40" height="20" rx="7" fill={color} opacity="0.75" />
      <rect x="86" y="56" width="28" height="10" rx="4" fill={color} opacity="0.4" />
      {/* 통 */}
      <rect
        x="62"
        y="64"
        width="76"
        height="94"
        rx="18"
        fill={`url(#${uid}-bo)`}
        stroke={color}
        strokeWidth="4"
      />
      <rect x="74" y="88" width="52" height="46" rx="11" fill={color} opacity="0.2" />
      <rect x="84" y="100" width="32" height="5" rx="2.5" fill={color} opacity="0.55" />
      <rect x="84" y="112" width="20" height="5" rx="2.5" fill={color} opacity="0.35" />
      {/* 알약 */}
      <g opacity="0.85">
        <rect
          x="140"
          y="118"
          width="26"
          height="13"
          rx="6.5"
          fill={color}
          opacity="0.35"
          transform="rotate(-18 153 124)"
        />
        <circle cx="46" cy="126" r="8" fill={color} opacity="0.28" />
      </g>
    </g>
  );
}
