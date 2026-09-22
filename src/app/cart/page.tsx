"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { ProductThumb } from "@/components/ProductThumb";
import { Empty, RxBadge, btnGhost, btnPrimary } from "@/components/ui";
import { Minus, Plus, Shield, Trash, Truck } from "@/components/icons/Ico";
import { FREE_SHIPPING_OVER, won } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

export default function CartPage() {
  const { lines, ready, subtotal, shipping, total, setQty, remove, clear } =
    useCart();
  const router = useRouter();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
  }, []);

  const remain = Math.max(0, FREE_SHIPPING_OVER - subtotal);
  const hasRx = lines.some((l) => l.rxRequired);

  if (!ready) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="h-8 w-40 animate-pulse rounded-full bg-cream-deep" />
        <div className="mt-8 space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-[22px] bg-cream-deep"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <nav className="mb-4 flex items-center gap-1.5 text-[12.5px] text-ink-faint">
        <Link href="/" className="transition hover:text-primary">
          홈
        </Link>
        <span>/</span>
        <span className="font-semibold text-ink-soft">장바구니</span>
      </nav>

      <h1 className="text-[28px] font-extrabold tracking-tight sm:text-[32px]">
        장바구니
      </h1>

      {lines.length === 0 ? (
        <div className="mt-8">
          <Empty
            title="장바구니가 아직 비어 있어요"
            desc="우리 아이 진단명으로 먼저 골라보시면 훨씬 빠릅니다."
            action={
              <Link href="/products" className={btnPrimary}>
                처방식 둘러보기
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* 목록 */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[13.5px] font-semibold text-ink-soft">
                총 <b className="font-extrabold text-ink">{lines.length}</b>종
              </p>
              <button
                type="button"
                onClick={clear}
                className="text-[13px] font-semibold text-ink-faint transition hover:text-primary"
              >
                전체 비우기
              </button>
            </div>

            <ul className="space-y-3">
              {lines.map((l) => (
                <li
                  key={l.productId}
                  className="flex gap-4 rounded-[22px] border border-line bg-surface p-4"
                >
                  <Link
                    href={`/products/${l.slug}`}
                    className="shrink-0 overflow-hidden rounded-2xl border border-line"
                  >
                    <ProductThumb
                      kind={l.kind ?? "dry"}
                      accent={l.accent}
                      compact
                      className="h-24 w-24"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        {l.rxRequired ? (
                          <div className="mb-1.5">
                            <RxBadge />
                          </div>
                        ) : null}
                        <Link
                          href={`/products/${l.slug}`}
                          className="block text-[14.5px] font-bold leading-snug transition hover:text-primary"
                        >
                          {l.name}
                        </Link>
                        {l.unitLabel ? (
                          <p className="mt-0.5 text-[12px] text-ink-faint">
                            {l.unitLabel}
                          </p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        aria-label="상품 삭제"
                        onClick={() => remove(l.productId)}
                        className="shrink-0 text-ink-faint transition hover:text-primary"
                      >
                        <Trash size={17} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-end justify-between gap-3">
                      <div className="flex items-center gap-1 rounded-full border border-line-strong bg-surface p-1">
                        <button
                          type="button"
                          aria-label="수량 줄이기"
                          onClick={() => setQty(l.productId, l.qty - 1)}
                          className="grid h-7 w-7 place-items-center rounded-full text-ink-soft transition hover:bg-primary-soft hover:text-primary-deep"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-[14px] font-bold tabular-nums">
                          {l.qty}
                        </span>
                        <button
                          type="button"
                          aria-label="수량 늘리기"
                          onClick={() => setQty(l.productId, l.qty + 1)}
                          className="grid h-7 w-7 place-items-center rounded-full text-ink-soft transition hover:bg-primary-soft hover:text-primary-deep"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-[16px] font-extrabold tracking-tight">
                        {won(l.unitPrice * l.qty)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {hasRx ? (
              <div className="mt-4 flex items-start gap-2.5 rounded-[20px] border border-primary/25 bg-primary-soft/50 px-5 py-4">
                <Shield size={17} className="mt-0.5 shrink-0 text-primary" />
                <p className="text-[13px] leading-relaxed text-ink-soft">
                  <b className="font-bold text-ink">처방식이 담겨 있어요.</b>{" "}
                  담당 수의사의 진단·처방을 먼저 확인해 주세요. 확실하지 않다면{" "}
                  <Link
                    href="/vets"
                    className="font-bold text-primary underline underline-offset-2"
                  >
                    수의사 상담
                  </Link>
                  에서 물어보실 수 있습니다.
                </p>
              </div>
            ) : null}
          </div>

          {/* 요약 */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[24px] border border-line bg-surface p-6">
              <h2 className="text-[16px] font-extrabold">결제 예정 금액</h2>

              <dl className="mt-5 space-y-2.5">
                <Row label="상품 금액" value={won(subtotal)} />
                <Row
                  label="배송비"
                  value={shipping === 0 ? "무료" : won(shipping)}
                />
              </dl>

              {remain > 0 ? (
                <div className="mt-4 rounded-2xl bg-cream-deep/60 px-4 py-3">
                  <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-soft">
                    <Truck size={15} className="text-primary" />
                    {won(remain)} 더 담으면 무료배송
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${Math.min(100, (subtotal / FREE_SHIPPING_OVER) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ) : null}

              <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
                <span className="text-[14px] font-bold">총 결제금액</span>
                <span className="text-[24px] font-extrabold tracking-tight text-primary">
                  {won(total)}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    signedIn ? "/checkout" : "/login?redirect=/checkout",
                  )
                }
                className={btnPrimary + " mt-5 w-full"}
              >
                {signedIn === false ? "로그인하고 주문하기" : "주문서 작성하기"}
              </button>

              <Link href="/products" className={btnGhost + " mt-2 w-full"}>
                더 둘러보기
              </Link>

              <p className="mt-4 text-center text-[11.5px] leading-relaxed text-ink-faint">
                토스페이먼츠 <b className="font-bold">테스트 모드</b>로 동작합니다.
                <br />
                실제 금액은 청구되지 않아요.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-[13.5px] text-ink-soft">{label}</dt>
      <dd className="text-[13.5px] font-bold">{value}</dd>
    </div>
  );
}
