import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductThumb } from "@/components/ProductThumb";
import { Empty, btnGhost, btnPrimary } from "@/components/ui";
import { External, Truck } from "@/components/icons/Ico";
import { formatDateTime, won } from "@/lib/format";
import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE } from "@/lib/labels";
import type { Order } from "@/lib/types";
import { SignOutButton } from "@/components/SignOutButton";

export const metadata: Metadata = { title: "주문 내역" };
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/orders");

  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as Order[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <nav className="mb-4 flex items-center gap-1.5 text-[12.5px] text-ink-faint">
        <Link href="/" className="transition hover:text-primary">
          홈
        </Link>
        <span>/</span>
        <span className="font-semibold text-ink-soft">주문 내역</span>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight sm:text-[32px]">
            주문 내역
          </h1>
          <p className="mt-2 text-[14px] text-ink-soft">
            {user.email} 님으로 로그인되어 있어요.
          </p>
        </div>
        <SignOutButton />
      </div>

      {orders.length === 0 ? (
        <div className="mt-10">
          <Empty
            title="아직 주문하신 내역이 없어요"
            desc="우리 아이 진단명으로 처방식을 먼저 찾아보세요."
            action={
              <Link href="/products" className={btnPrimary}>
                처방식 둘러보기
              </Link>
            }
          />
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((o) => {
            const tone = ORDER_STATUS_TONE[o.status];
            return (
              <li
                key={o.id}
                className="overflow-hidden rounded-[24px] border border-line bg-surface"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-cream-deep/40 px-6 py-4">
                  <div>
                    <p className="text-[12px] text-ink-faint">
                      {formatDateTime(o.created_at)}
                    </p>
                    <p className="mt-0.5 font-mono text-[12px] font-bold">
                      {o.order_code}
                    </p>
                  </div>
                  <span
                    className="rounded-full px-3 py-1.5 text-[12px] font-extrabold"
                    style={{ color: tone.fg, background: tone.bg }}
                  >
                    {ORDER_STATUS_LABEL[o.status]}
                  </span>
                </div>

                <div className="px-6 py-5">
                  <ul className="space-y-3">
                    {(o.order_items ?? []).map((it) => (
                      <li key={it.id} className="flex items-center gap-4">
                        <span className="shrink-0 overflow-hidden rounded-2xl border border-line">
                          <ProductThumb
                            kind="dry"
                            accent="#E07A46"
                            seed={it.slug ?? String(it.id)}
                            compact
                            className="h-16 w-16"
                          />
                        </span>
                        <div className="min-w-0 flex-1">
                          {it.slug ? (
                            <Link
                              href={`/products/${it.slug}`}
                              className="block truncate text-[14px] font-bold transition hover:text-primary"
                            >
                              {it.name}
                            </Link>
                          ) : (
                            <p className="truncate text-[14px] font-bold">
                              {it.name}
                            </p>
                          )}
                          <p className="mt-0.5 text-[12.5px] text-ink-faint">
                            {won(it.unit_price)} · {it.qty}개
                          </p>
                        </div>
                        <p className="shrink-0 text-[14px] font-bold">
                          {won(it.unit_price * it.qty)}
                        </p>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-line pt-5">
                    <div className="text-[12.5px] leading-relaxed text-ink-soft">
                      <p className="flex items-center gap-1.5">
                        <Truck size={14} className="text-ink-faint" />
                        {o.orderer_name} · {o.phone}
                      </p>
                      <p className="mt-0.5 pl-[22px]">
                        {o.address}
                        {o.address_detail ? ` ${o.address_detail}` : ""}
                      </p>
                      {o.memo ? (
                        <p className="mt-0.5 pl-[22px] text-ink-faint">
                          메모: {o.memo}
                        </p>
                      ) : null}
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] text-ink-soft">총 결제금액</p>
                      <p className="text-[20px] font-extrabold tracking-tight text-primary">
                        {won(o.amount)}
                      </p>
                      {o.method ? (
                        <p className="text-[12px] text-ink-faint">{o.method}</p>
                      ) : null}
                    </div>
                  </div>

                  {o.receipt_url ? (
                    <a
                      href={o.receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-primary transition hover:underline"
                    >
                      영수증 보기
                      <External size={13} />
                    </a>
                  ) : null}

                  {o.status === "pending" ? (
                    <Link href="/cart" className={btnGhost + " mt-4"}>
                      결제 다시 시도하기
                    </Link>
                  ) : null}

                  {o.status === "failed" && o.fail_reason ? (
                    <p className="mt-4 rounded-2xl bg-primary-soft px-4 py-3 text-[12.5px] text-primary-deep">
                      실패 사유: {o.fail_reason}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
