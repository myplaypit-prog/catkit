import Link from "next/link";
import type { ReactNode } from "react";
import { Star } from "./icons/Ico";

/* ── 뱃지 ─────────────────────────────────────────────── */

export function Badge({
  children,
  fg = "#7A6557",
  bg = "#F5EDE4",
  className = "",
}: {
  children: ReactNode;
  fg?: string;
  bg?: string;
  className?: string;
}) {
  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap " +
        className
      }
      style={{ color: fg, background: bg }}
    >
      {children}
    </span>
  );
}

export function RxBadge() {
  return (
    <Badge fg="#9F432A" bg="#FDEDE3">
      처방식
    </Badge>
  );
}

/* ── 섹션 헤더 ────────────────────────────────────────── */

export function SectionHead({
  eyebrow,
  title,
  desc,
  href,
  hrefLabel = "전체 보기",
}: {
  eyebrow?: string;
  title: ReactNode;
  desc?: ReactNode;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-xs font-bold tracking-wide text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-[22px] font-bold leading-snug sm:text-[26px]">
          {title}
        </h2>
        {desc ? (
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
            {desc}
          </p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="shrink-0 rounded-full border border-line-strong bg-surface px-4 py-2 text-[13px] font-semibold text-ink-soft transition hover:border-primary hover:text-primary"
        >
          {hrefLabel}
        </Link>
      ) : null}
    </div>
  );
}

/* ── 별점 ─────────────────────────────────────────────── */

export function Rating({
  value,
  count,
  size = 14,
  className = "",
}: {
  value: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={"inline-flex items-center gap-1 " + className}>
      <Star size={size} className="text-honey" />
      <span className="text-[13px] font-bold text-ink">{value.toFixed(1)}</span>
      {typeof count === "number" ? (
        <span className="text-[12px] text-ink-faint">({count})</span>
      ) : null}
    </span>
  );
}

/* ── 카드 컨테이너 ────────────────────────────────────── */

export function Card({
  children,
  className = "",
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  return (
    <As
      className={
        "rounded-[24px] border border-line bg-surface shadow-[var(--shadow-soft)] " +
        className
      }
    >
      {children}
    </As>
  );
}

/* ── 빈 상태 ──────────────────────────────────────────── */

export function Empty({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-[26px] border border-dashed border-line-strong bg-surface/70 px-6 py-16 text-center">
      <SleepyCat />
      <p className="mt-5 text-[16px] font-bold">{title}</p>
      {desc ? (
        <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-ink-soft">
          {desc}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

function SleepyCat() {
  return (
    <svg width="132" height="92" viewBox="0 0 132 92" aria-hidden="true">
      <ellipse cx="66" cy="82" rx="44" ry="6" fill="#EFE2D4" />
      {/* 방석 */}
      <path
        d="M22 78c0-9 11-15 44-15s44 6 44 15-20 6-44 6-44 3-44-6Z"
        fill="#FDEDE3"
      />
      {/* 몸 */}
      <path
        d="M34 68c0-15 14-25 32-25s32 10 32 25c0 6-14 9-32 9s-32-3-32-9Z"
        fill="#F7E7D2"
      />
      {/* 꼬리 */}
      <path
        d="M96 70c9 1 15-3 15-9s-5-9-10-7"
        fill="none"
        stroke="#EBD5B9"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* 귀 */}
      <g strokeLinejoin="round" strokeWidth="6">
        <path d="M48 44 45 26l17 8Z" fill="#F7E7D2" stroke="#F7E7D2" />
        <path d="M84 44 87 26l-17 8Z" fill="#F7E7D2" stroke="#F7E7D2" />
      </g>
      {/* 머리 */}
      <ellipse cx="66" cy="44" rx="25" ry="22" fill="#FFF6EA" />
      {/* 감은 눈 */}
      <g fill="none" stroke="#4A382C" strokeWidth="3" strokeLinecap="round">
        <path d="M53 44q4 3.5 8 0" />
        <path d="M71 44q4 3.5 8 0" />
      </g>
      <ellipse cx="50" cy="51" rx="5" ry="3.4" fill="#F3A793" opacity="0.4" />
      <ellipse cx="82" cy="51" rx="5" ry="3.4" fill="#F3A793" opacity="0.4" />
      <path d="M66 54 63 51h6Z" fill="#E08E7E" />
      {/* zzz */}
      <g fill="#C9B49E">
        <text x="96" y="26" fontSize="13" fontWeight="700">z</text>
        <text x="105" y="16" fontSize="16" fontWeight="700">z</text>
        <text x="116" y="8" fontSize="10" fontWeight="700">z</text>
      </g>
    </svg>
  );
}

/* ── 버튼 클래스 (일관된 톤) ──────────────────────────── */

export const btnPrimary =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-[14px] font-bold text-white shadow-[0_8px_24px_-12px_rgba(159,67,42,.72)] transition hover:-translate-y-0.5 hover:bg-primary-deep active:scale-[0.985] disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-ink-faint";

export const btnGhost =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line-strong bg-surface px-6 py-3 text-[14px] font-bold text-ink transition hover:-translate-y-0.5 hover:border-primary hover:text-primary active:scale-[0.985]";

export const btnSoft =
  "inline-flex items-center justify-center gap-2 rounded-full bg-primary-soft px-5 py-3 text-[14px] font-bold text-primary-deep transition hover:bg-blush/50 active:scale-[0.985]";

export const inputBase =
  "w-full rounded-2xl border border-line-strong bg-surface px-4 py-3 text-[14px] outline-none transition placeholder:text-ink-faint focus:border-primary focus:ring-4 focus:ring-primary-soft";
