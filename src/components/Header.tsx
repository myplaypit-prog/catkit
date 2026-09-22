"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { User as SupaUser } from "@supabase/supabase-js";
import type { Category } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "./CartProvider";
import { useWishlist } from "./WishlistProvider";
import { CatMark, CategoryIcon } from "./icons/CatArt";
import {
  Cart,
  ChevronDown,
  Close,
  Heart,
  Menu,
  Search,
  User,
} from "./icons/Ico";

const NAV = [
  { href: "/products", label: "처방식 전체" },
  { href: "/supplements", label: "건강기능식품" },
  { href: "/vets", label: "수의사 상담" },
  { href: "/clinics", label: "우리 동네 병원" },
];

export function Header({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { count, ready } = useCart();
  const { count: wishCount, ready: wishReady } = useWishlist();
  const [user, setUser] = useState<SupaUser | null>(null);
  const [q, setQ] = useState("");
  const catRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  /*
   * 메뉴는 "열려 있다"가 아니라 "어느 경로에서 열었나"를 기억합니다.
   * 페이지를 이동하면 pathname이 달라지므로 따로 닫아주지 않아도
   * 자동으로 닫힙니다 — effect 안에서 setState 할 일이 없어집니다.
   */
  const [menuAt, setMenuAt] = useState<string | null>(null);
  const [catAt, setCatAt] = useState<string | null>(null);
  const openMenu = menuAt === pathname;
  const openCat = catAt === pathname;

  const setOpenMenu = (open: boolean) => setMenuAt(open ? pathname : null);
  const setOpenCat = (open: boolean) => setCatAt(open ? pathname : null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatAt(null);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/products?q=${encodeURIComponent(term)}` : "/products");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-cream/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link
          href="/"
          aria-label="무병장수 홈"
          className="flex shrink-0 items-center gap-2.5"
        >
          <CatMark size={38} />
          <span className="flex flex-col leading-none">
            <span className="text-[20px] font-extrabold tracking-[-.045em] text-ink sm:text-[21px]">
              무병장수
            </span>
            <span className="mt-[3px] hidden text-[10px] font-bold tracking-[.01em] text-primary-deep sm:block">
              고양이 처방식 · 건강식
            </span>
          </span>
        </Link>

        {/* 데스크톱 내비 */}
        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          <div className="relative" ref={catRef}>
            <button
              type="button"
              onClick={() => setOpenCat(!openCat)}
              className="flex items-center gap-1 rounded-full px-3 py-2 text-[14px] font-semibold text-ink-soft transition hover:bg-primary-soft hover:text-primary-deep"
              aria-expanded={openCat}
            >
              질환별로 찾기
              <ChevronDown
                size={15}
                className={openCat ? "rotate-180 transition" : "transition"}
              />
            </button>
            {openCat ? (
              <div className="absolute left-0 top-full mt-2 w-[330px] overflow-hidden rounded-[20px] border border-line bg-surface p-2 shadow-[var(--shadow-lift)]">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/categories/${c.slug}`}
                    className="flex items-start gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-cream-deep"
                  >
                    <span
                      className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                      style={{ background: c.accent_soft, color: c.accent }}
                    >
                      <CategoryIcon name={c.icon} size={19} />
                    </span>
                    <span>
                      <span className="block text-[14px] font-bold">{c.name}</span>
                      <span className="block text-[12px] text-ink-soft">
                        {c.tagline}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={
                "rounded-full px-3 py-2 text-[14px] font-semibold transition hover:bg-primary-soft hover:text-primary-deep " +
                (pathname.startsWith(n.href) ? "text-primary" : "text-ink-soft")
              }
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          {/* 모바일: 검색은 1차 동선이라 헤더에서 한 번에 열 수 있게 */}
          <button
            type="button"
            onClick={() => {
              setOpenMenu(true);
              requestAnimationFrame(() => mobileSearchRef.current?.focus());
            }}
            aria-label="상품 검색 열기"
            className="grid h-10 w-10 place-items-center rounded-full text-ink-soft transition hover:bg-primary-soft hover:text-primary-deep md:hidden"
          >
            <Search size={20} />
          </button>

          <form
            onSubmit={submitSearch}
            className="hidden items-center gap-2 rounded-full border border-line-strong bg-surface px-3.5 py-2 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary-soft md:flex"
          >
            <Search size={17} className="text-ink-faint" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="신부전 사료, 유산균…"
              aria-label="상품 검색"
              className="w-40 bg-transparent text-[13px] outline-none placeholder:text-ink-faint lg:w-48"
            />
          </form>

          <Link
            href="/wishlist"
            aria-label={
              wishReady && wishCount > 0
                ? `찜한 상품 ${wishCount}개`
                : "찜한 상품"
            }
            className="relative grid h-10 w-10 place-items-center rounded-full text-ink-soft transition hover:bg-primary-soft hover:text-primary-deep"
          >
            <Heart size={21} filled={wishReady && wishCount > 0} />
            {wishReady && wishCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {wishCount > 99 ? "99+" : wishCount}
              </span>
            ) : null}
          </Link>

          <Link
            href="/cart"
            aria-label="장바구니"
            className="relative grid h-10 w-10 place-items-center rounded-full text-ink-soft transition hover:bg-primary-soft hover:text-primary-deep"
          >
            <Cart size={21} />
            {ready && count > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {count > 99 ? "99+" : count}
              </span>
            ) : null}
          </Link>

          <Link
            href={user ? "/orders" : "/login"}
            aria-label={user ? "내 주문" : "로그인"}
            className="hidden h-10 w-10 place-items-center rounded-full text-ink-soft transition hover:bg-primary-soft hover:text-primary-deep sm:grid"
          >
            <User size={21} />
          </Link>

          <button
            type="button"
            onClick={() => setOpenMenu(!openMenu)}
            aria-label="메뉴"
            className="grid h-10 w-10 place-items-center rounded-full text-ink-soft transition hover:bg-primary-soft lg:hidden"
          >
            {openMenu ? <Close size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {openMenu ? (
        <div className="border-t border-line bg-surface px-4 pb-5 pt-4 lg:hidden">
          <form
            onSubmit={submitSearch}
            className="mb-4 flex items-center gap-2 rounded-full border border-line-strong px-4 py-2.5"
          >
            <Search size={17} className="text-ink-faint" />
            <input
              ref={mobileSearchRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="어떤 증상을 찾고 계신가요?"
              aria-label="상품 검색"
              className="w-full bg-transparent text-[14px] outline-none placeholder:text-ink-faint"
            />
          </form>

          <p className="mb-2 px-1 text-[11px] font-bold text-ink-faint">질환별</p>
          <div className="mb-4 grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="flex items-center gap-2 rounded-2xl border border-line px-3 py-2.5"
              >
                <span
                  className="grid h-8 w-8 place-items-center rounded-lg"
                  style={{ background: c.accent_soft, color: c.accent }}
                >
                  <CategoryIcon name={c.icon} size={17} />
                </span>
                <span className="text-[13px] font-bold">{c.name}</span>
              </Link>
            ))}
          </div>

          <div className="grid gap-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-2xl px-3 py-3 text-[15px] font-semibold text-ink-soft transition hover:bg-cream-deep"
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/wishlist"
              className="rounded-2xl px-3 py-3 text-[15px] font-semibold text-ink-soft transition hover:bg-cream-deep"
            >
              찜한 상품
              {wishReady && wishCount > 0 ? (
                <span className="ml-1.5 text-primary">{wishCount}</span>
              ) : null}
            </Link>
            <Link
              href={user ? "/orders" : "/login"}
              className="rounded-2xl px-3 py-3 text-[15px] font-semibold text-ink-soft transition hover:bg-cream-deep"
            >
              {user ? "내 주문 내역" : "로그인 / 회원가입"}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
