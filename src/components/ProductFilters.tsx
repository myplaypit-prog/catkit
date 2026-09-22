"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Brand, Category } from "@/lib/types";
import { KIND_LABEL, LIFE_STAGE_SHORT, SUPP_LABEL } from "@/lib/labels";
import { CategoryIcon } from "./icons/CatArt";
import { Close, Search } from "./icons/Ico";

type Props = {
  categories: Category[];
  brands: Brand[];
  basePath: string;
  /** 건강기능식품 전용 페이지에서는 제형 필터를 숨깁니다 */
  lockKind?: boolean;
};

const LIFE_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "kitten", label: LIFE_STAGE_SHORT.kitten },
  { value: "adult", label: LIFE_STAGE_SHORT.adult },
  { value: "senior", label: LIFE_STAGE_SHORT.senior },
];

const KIND_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "dry", label: KIND_LABEL.dry },
  { value: "wet", label: KIND_LABEL.wet },
  { value: "supplement", label: KIND_LABEL.supplement },
];

const RX_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "rx", label: "처방 필요" },
  { value: "otc", label: "처방 불필요" },
];

const SUPP_OPTIONS = [
  { value: "all", label: "전체" },
  ...Object.entries(SUPP_LABEL).map(([value, label]) => ({ value, label })),
];

export function ProductFilters({
  categories,
  brands,
  basePath,
  lockKind = false,
}: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const [openMobile, setOpenMobile] = useState(false);

  /*
   * URL이 바뀌면(뒤로가기, 필터 초기화 등) 검색창도 따라가야 합니다.
   * effect로 되돌리면 한 프레임 늦어 깜빡이므로 렌더 중에 조정합니다.
   * https://react.dev/learn/you-might-not-need-an-effect
   */
  const urlTerm = sp.get("q") ?? "";
  const [term, setTerm] = useState(urlTerm);
  const [lastUrlTerm, setLastUrlTerm] = useState(urlTerm);
  if (lastUrlTerm !== urlTerm) {
    setLastUrlTerm(urlTerm);
    setTerm(urlTerm);
  }

  const get = (k: string, d = "all") => sp.get(k) ?? d;

  function push(next: Record<string, string | null>) {
    const params = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(next)) {
      if (!v || v === "all" || v === "") params.delete(k);
      else params.set(k, v);
    }
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath, { scroll: false });
  }

  const activeCount = ["condition", "kind", "brand", "life", "supp", "rx", "q"]
    .filter((k) => sp.get(k) && sp.get(k) !== "all")
    .length;

  const showSupp = lockKind || get("kind") === "supplement";

  const body = (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          push({ q: term.trim() || null });
          setOpenMobile(false);
        }}
      >
        <FilterLabel>키워드 검색</FilterLabel>
        <div className="flex items-center gap-2 rounded-2xl border border-line-strong bg-surface px-3.5 py-2.5 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary-soft">
          <Search size={16} className="shrink-0 text-ink-faint" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="제품명, 증상, 성분"
            aria-label="상품 검색"
            className="w-full bg-transparent text-[13.5px] outline-none placeholder:text-ink-faint"
          />
          {term ? (
            <button
              type="button"
              aria-label="검색어 지우기"
              onClick={() => {
                setTerm("");
                push({ q: null });
              }}
              className="shrink-0 text-ink-faint transition hover:text-primary"
            >
              <Close size={15} />
            </button>
          ) : null}
        </div>
      </form>

      <div>
        <FilterLabel>질환</FilterLabel>
        <div className="grid gap-1.5">
          <ChipRow
            active={get("condition") === "all"}
            onClick={() => push({ condition: null })}
            label="전체 질환"
          />
          {categories.map((c) => {
            const active = get("condition") === c.slug;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => push({ condition: active ? null : c.slug })}
                className={
                  "flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-left text-[13.5px] font-semibold transition " +
                  (active
                    ? "border-transparent text-white"
                    : "border-line bg-surface text-ink-soft hover:border-line-strong")
                }
                style={active ? { background: c.accent } : undefined}
              >
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-lg"
                  style={
                    active
                      ? { background: "rgba(255,255,255,0.22)", color: "#fff" }
                      : { background: c.accent_soft, color: c.accent }
                  }
                >
                  <CategoryIcon name={c.icon} size={15} />
                </span>
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {!lockKind ? (
        <div>
          <FilterLabel>제형</FilterLabel>
          <Pills
            options={KIND_OPTIONS}
            value={get("kind")}
            onChange={(v) => push({ kind: v, supp: v === "supplement" ? get("supp") : null })}
          />
        </div>
      ) : null}

      {showSupp ? (
        <div>
          <FilterLabel>영양제 종류</FilterLabel>
          <Pills
            options={SUPP_OPTIONS}
            value={get("supp")}
            onChange={(v) => push({ supp: v })}
          />
        </div>
      ) : null}

      <div>
        <FilterLabel>연령</FilterLabel>
        <Pills
          options={LIFE_OPTIONS}
          value={get("life")}
          onChange={(v) => push({ life: v })}
        />
        <p className="mt-2 text-[11.5px] leading-snug text-ink-faint">
          전연령 제품은 어떤 연령을 골라도 함께 표시됩니다.
        </p>
      </div>

      <div>
        <FilterLabel>처방전</FilterLabel>
        <Pills
          options={RX_OPTIONS}
          value={get("rx")}
          onChange={(v) => push({ rx: v })}
        />
      </div>

      <div>
        <FilterLabel>제조사</FilterLabel>
        <select
          value={get("brand")}
          onChange={(e) => push({ brand: e.target.value })}
          className="w-full rounded-2xl border border-line-strong bg-surface px-3.5 py-2.5 text-[13.5px] font-semibold outline-none transition focus:border-primary focus:ring-4 focus:ring-primary-soft"
        >
          <option value="all">전체 제조사</option>
          {brands.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.name}
              {b.country ? ` (${b.country})` : ""}
            </option>
          ))}
        </select>
      </div>

      {activeCount > 0 ? (
        <button
          type="button"
          onClick={() => {
            setTerm("");
            router.push(basePath, { scroll: false });
            setOpenMobile(false);
          }}
          className="w-full rounded-2xl border border-line-strong bg-surface py-2.5 text-[13px] font-bold text-ink-soft transition hover:border-primary hover:text-primary"
        >
          필터 {activeCount}개 모두 지우기
        </button>
      ) : null}
    </div>
  );

  return (
    <>
      {/* 모바일 토글 */}
      <button
        type="button"
        onClick={() => setOpenMobile(true)}
        className="flex w-full items-center justify-between rounded-2xl border border-line-strong bg-surface px-4 py-3 text-[14px] font-bold lg:hidden"
      >
        필터 · 검색
        {activeCount > 0 ? (
          <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">
            {activeCount}
          </span>
        ) : (
          <Search size={17} className="text-ink-faint" />
        )}
      </button>

      {openMobile ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            onClick={() => setOpenMobile(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto rounded-t-[28px] bg-cream p-5 pb-8">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[16px] font-extrabold">필터</p>
              <button
                type="button"
                aria-label="닫기"
                onClick={() => setOpenMobile(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-surface text-ink-soft"
              >
                <Close size={18} />
              </button>
            </div>
            {body}
            <button
              type="button"
              onClick={() => setOpenMobile(false)}
              className="mt-6 w-full rounded-full bg-primary py-3.5 text-[14px] font-bold text-white"
            >
              결과 보기
            </button>
          </div>
        </div>
      ) : null}

      <div className="hidden lg:block">{body}</div>
    </>
  );
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2.5 text-[12px] font-extrabold tracking-wide text-ink">
      {children}
    </p>
  );
}

function ChipRow({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-2xl border px-3 py-2.5 text-left text-[13.5px] font-semibold transition " +
        (active
          ? "border-primary bg-primary-soft text-primary-deep"
          : "border-line bg-surface text-ink-soft hover:border-line-strong")
      }
    >
      {label}
    </button>
  );
}

function Pills({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={
              "rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition " +
              (active
                ? "border-primary bg-primary text-white"
                : "border-line-strong bg-surface text-ink-soft hover:border-primary hover:text-primary")
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** 정렬 셀렉트 — 목록 상단 오른쪽 */
export function SortSelect({ basePath }: { basePath: string }) {
  const router = useRouter();
  const sp = useSearchParams();

  return (
    <select
      value={sp.get("sort") ?? "recommend"}
      onChange={(e) => {
        const params = new URLSearchParams(sp.toString());
        if (e.target.value === "recommend") params.delete("sort");
        else params.set("sort", e.target.value);
        const qs = params.toString();
        router.push(qs ? `${basePath}?${qs}` : basePath, { scroll: false });
      }}
      aria-label="정렬"
      className="rounded-full border border-line-strong bg-surface px-3.5 py-2 text-[13px] font-semibold outline-none transition focus:border-primary"
    >
      <option value="recommend">추천순</option>
      <option value="review">후기 많은순</option>
      <option value="price_asc">가격 낮은순</option>
      <option value="price_desc">가격 높은순</option>
      <option value="new">신상품순</option>
    </select>
  );
}
