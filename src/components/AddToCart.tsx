"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductWithRefs } from "@/lib/types";
import { finalPrice, won } from "@/lib/format";
import { useCart } from "./CartProvider";
import { Cart, Check, Minus, Plus } from "./icons/Ico";
import { btnGhost, btnPrimary } from "./ui";

function toLine(p: ProductWithRefs) {
  return {
    productId: p.id,
    slug: p.slug,
    name: p.name,
    unitPrice: finalPrice(p.price, p.sale_price),
    unitLabel: p.unit_label,
    accent: p.accent ?? p.category?.accent ?? null,
    seed: p.slug,
    rxRequired: p.rx_required,
  };
}

/** 카드 하단의 작은 담기 버튼 */
export function AddToCartMini({ product }: { product: ProductWithRefs }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        add(toLine(product));
        setDone(true);
        window.setTimeout(() => setDone(false), 1400);
      }}
      className={
        "flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] font-bold transition " +
        (done
          ? "bg-sage-soft text-sage"
          : "bg-primary-soft text-primary-deep hover:bg-blush/50")
      }
    >
      {done ? (
        <>
          <Check size={16} /> 담았어요
        </>
      ) : (
        <>
          <Cart size={16} /> 장바구니
        </>
      )}
    </button>
  );
}

/** 상세 페이지의 수량 선택 + 담기 / 바로구매 */
export function AddToCartPanel({ product }: { product: ProductWithRefs }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);

  const unit = finalPrice(product.price, product.sale_price);
  const soldOut = product.stock <= 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-line bg-cream-deep/50 px-4 py-3">
        <span className="text-[13px] font-semibold text-ink-soft">수량</span>
        <div className="flex items-center gap-1 rounded-full border border-line-strong bg-surface p-1">
          <button
            type="button"
            aria-label="수량 줄이기"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition hover:bg-primary-soft hover:text-primary-deep"
          >
            <Minus size={16} />
          </button>
          <span className="w-9 text-center text-[15px] font-bold tabular-nums">
            {qty}
          </span>
          <button
            type="button"
            aria-label="수량 늘리기"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition hover:bg-primary-soft hover:text-primary-deep"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-baseline justify-between px-1">
        <span className="text-[13px] font-semibold text-ink-soft">주문 금액</span>
        <span className="text-[22px] font-extrabold tracking-tight">
          {won(unit * qty)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={soldOut}
          onClick={() => {
            add(toLine(product), qty);
            setDone(true);
            window.setTimeout(() => setDone(false), 1600);
          }}
          className={btnGhost + " w-full"}
        >
          {done ? (
            <>
              <Check size={17} /> 담았어요
            </>
          ) : (
            <>
              <Cart size={17} /> 장바구니
            </>
          )}
        </button>
        <button
          type="button"
          disabled={soldOut}
          onClick={() => {
            add(toLine(product), qty);
            router.push("/cart");
          }}
          className={btnPrimary + " w-full"}
        >
          {soldOut ? "품절" : "바로 구매하기"}
        </button>
      </div>
    </div>
  );
}
