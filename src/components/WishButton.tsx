"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useWishlist } from "./WishlistProvider";
import { Heart } from "./icons/Ico";

/**
 * 카드 썸네일 위에 얹는 원형 하트.
 * 카드 전체가 Link 라서 클릭이 상세로 새지 않도록 막아줍니다.
 */
export function WishButton({
  productId,
  productName,
  className = "",
}: {
  productId: number;
  productName: string;
  className?: string;
}) {
  const { has, toggle, signedIn, ready } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);

  const on = has(productId);

  async function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!signedIn) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setBusy(true);
    const ok = await toggle(productId);
    setBusy(false);

    // 찜 목록에서 뺐다면 그 카드도 사라져야 합니다 (서버 컴포넌트라 갱신이 필요)
    if (ok && pathname === "/wishlist") router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy || !ready}
      aria-pressed={on}
      aria-label={`${productName} ${on ? "찜 해제" : "찜하기"}`}
      title={on ? "찜 해제" : "찜하기"}
      className={
        "grid h-9 w-9 place-items-center rounded-full border backdrop-blur transition active:scale-90 disabled:opacity-60 " +
        (on
          ? "border-primary/30 bg-primary text-white"
          : "border-white/70 bg-white/85 text-ink-soft hover:text-primary") +
        " " +
        className
      }
    >
      <Heart size={18} filled={on} />
    </button>
  );
}

/** 상세 페이지용 — 글자가 함께 붙은 넓은 버튼 */
export function WishButtonWide({
  productId,
  productName,
}: {
  productId: number;
  productName: string;
}) {
  const { has, toggle, signedIn, ready } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);

  const on = has(productId);

  async function onClick() {
    if (!signedIn) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setBusy(true);
    await toggle(productId);
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy || !ready}
      aria-pressed={on}
      aria-label={`${productName} ${on ? "찜 해제" : "찜하기"}`}
      className={
        "inline-flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3 text-[14px] font-bold transition active:scale-[0.985] disabled:opacity-60 " +
        (on
          ? "border-primary bg-primary-soft text-primary-deep"
          : "border-line-strong bg-surface text-ink hover:border-primary hover:text-primary")
      }
    >
      <Heart size={17} filled={on} />
      {on ? "찜한 상품" : "찜하기"}
    </button>
  );
}
