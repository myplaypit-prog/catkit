"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Close, Search } from "./icons/Ico";

export function ClinicSearch({ regions }: { regions: string[] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [term, setTerm] = useState(sp.get("q") ?? "");

  useEffect(() => {
    setTerm(sp.get("q") ?? "");
  }, [sp]);

  const region = sp.get("region") ?? "all";
  const night = sp.get("night") === "1";

  function push(next: Record<string, string | null>) {
    const params = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(next)) {
      if (!v || v === "all") params.delete(k);
      else params.set(k, v);
    }
    const qs = params.toString();
    router.push(qs ? `/clinics?${qs}` : "/clinics", { scroll: false });
  }

  return (
    <div className="space-y-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          push({ q: term.trim() || null });
        }}
        className="flex items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-3 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary-soft"
      >
        <Search size={18} className="shrink-0 text-ink-faint" />
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="병원 이름이나 동네를 입력해 보세요"
          aria-label="병원 검색"
          className="w-full bg-transparent text-[14px] outline-none placeholder:text-ink-faint"
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
            <Close size={16} />
          </button>
        ) : null}
        <button
          type="submit"
          className="shrink-0 rounded-full bg-primary px-4 py-1.5 text-[13px] font-bold text-white transition hover:bg-primary-deep"
        >
          찾기
        </button>
      </form>

      <div className="flex flex-wrap gap-1.5">
        <Pill active={region === "all"} onClick={() => push({ region: null })}>
          전체 지역
        </Pill>
        {regions.map((r) => (
          <Pill
            key={r}
            active={region === r}
            onClick={() => push({ region: region === r ? null : r })}
          >
            {r}
          </Pill>
        ))}
        <Pill
          active={night}
          onClick={() => push({ night: night ? null : "1" })}
          tone="warn"
        >
          24시 응급만
        </Pill>
      </div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
  tone = "default",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tone?: "default" | "warn";
}) {
  const base =
    "rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition ";
  const on =
    tone === "warn"
      ? "border-primary bg-primary text-white"
      : "border-sage bg-sage text-white";
  const off =
    "border-line-strong bg-surface text-ink-soft hover:border-primary hover:text-primary";

  return (
    <button type="button" onClick={onClick} className={base + (active ? on : off)}>
      {children}
    </button>
  );
}
