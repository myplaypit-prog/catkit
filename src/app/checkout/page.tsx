"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  loadTossPayments,
  type TossPaymentsWidgets,
} from "@tosspayments/tosspayments-sdk";
import type { User } from "@supabase/supabase-js";
import { useCart } from "@/components/CartProvider";
import { createClient } from "@/lib/supabase/client";
import { makeOrderCode, won } from "@/lib/format";
import { Shield, Truck } from "@/components/icons/Ico";
import { btnPrimary, inputBase } from "@/components/ui";

const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

type Form = {
  ordererName: string;
  phone: string;
  postcode: string;
  address: string;
  addressDetail: string;
  memo: string;
};

const EMPTY_FORM: Form = {
  ordererName: "",
  phone: "",
  postcode: "",
  address: "",
  addressDetail: "",
  memo: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, ready, subtotal, shipping, total } = useCart();

  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY_FORM);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [widgetReady, setWidgetReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const renderedRef = useRef(false);

  /* ── 로그인 확인 ─────────────────────────────────── */
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setAuthChecked(true);
      if (!data.user) router.replace("/login?redirect=/checkout");
      else {
        setForm((f) => ({
          ...f,
          ordererName:
            (data.user.user_metadata?.name as string | undefined) ??
            data.user.email?.split("@")[0] ??
            "",
        }));
      }
    });
  }, [router]);

  /* ── 장바구니가 비면 되돌리기 ───────────────────── */
  useEffect(() => {
    if (ready && lines.length === 0 && !submitting) router.replace("/cart");
  }, [ready, lines.length, router, submitting]);

  /* ── 토스 위젯 초기화 ───────────────────────────── */
  useEffect(() => {
    if (!user) return;
    let alive = true;

    (async () => {
      try {
        const tossPayments = await loadTossPayments(CLIENT_KEY);
        // customerKey는 추측하기 어려운 값이어야 합니다 — Supabase user id 사용
        const w = tossPayments.widgets({ customerKey: user.id });
        if (alive) setWidgets(w);
      } catch (e) {
        console.error(e);
        if (alive)
          setError(
            "결제 모듈을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
          );
      }
    })();

    return () => {
      alive = false;
    };
  }, [user]);

  /* ── 금액 설정 + UI 렌더 ────────────────────────── */
  useEffect(() => {
    if (!widgets || total <= 0) return;
    let alive = true;

    (async () => {
      try {
        await widgets.setAmount({ currency: "KRW", value: total });

        if (!renderedRef.current) {
          renderedRef.current = true;
          await Promise.all([
            widgets.renderPaymentMethods({
              selector: "#payment-method",
              variantKey: "DEFAULT",
            }),
            widgets.renderAgreement({
              selector: "#agreement",
              variantKey: "AGREEMENT",
            }),
          ]);
        }
        if (alive) setWidgetReady(true);
      } catch (e) {
        console.error(e);
        if (alive) setError("결제 수단을 표시하지 못했습니다.");
      }
    })();

    return () => {
      alive = false;
    };
  }, [widgets, total]);

  const set = useCallback(
    (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value })),
    [],
  );

  const orderName =
    lines.length === 0
      ? ""
      : lines.length === 1
        ? lines[0].name
        : `${lines[0].name} 외 ${lines.length - 1}건`;

  async function handlePay() {
    if (!widgets || !user) return;
    setError(null);

    if (!form.ordererName.trim()) return setError("주문하시는 분 성함을 입력해 주세요.");
    if (!/^[0-9-]{9,13}$/.test(form.phone.trim()))
      return setError("연락처를 숫자와 하이픈으로 입력해 주세요.");
    if (!form.address.trim()) return setError("배송 주소를 입력해 주세요.");

    setSubmitting(true);
    const supabase = createClient();
    const orderCode = makeOrderCode();

    try {
      // 1) 결제 전 주문서를 pending 상태로 저장 — 승인 단계에서 금액을 대조합니다.
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          order_code: orderCode,
          user_id: user.id,
          status: "pending",
          amount: total,
          order_name: orderName,
          orderer_name: form.ordererName.trim(),
          phone: form.phone.trim(),
          postcode: form.postcode.trim() || null,
          address: form.address.trim(),
          address_detail: form.addressDetail.trim() || null,
          memo: form.memo.trim() || null,
        })
        .select("id")
        .single();

      if (orderErr || !order) throw orderErr ?? new Error("주문 생성 실패");

      const { error: itemErr } = await supabase.from("order_items").insert(
        lines.map((l) => ({
          order_id: order.id,
          product_id: l.productId,
          name: l.name,
          slug: l.slug,
          unit_price: l.unitPrice,
          qty: l.qty,
        })),
      );
      if (itemErr) throw itemErr;

      // 2) 토스 결제창 호출 (성공 시 successUrl로 리다이렉트)
      const origin = window.location.origin;
      await widgets.requestPayment({
        orderId: orderCode,
        orderName,
        successUrl: `${origin}/checkout/success`,
        failUrl: `${origin}/checkout/fail`,
        customerEmail: user.email ?? undefined,
        customerName: form.ordererName.trim(),
      });
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "결제를 시작하지 못했습니다.";
      // 사용자가 결제창을 닫은 경우도 여기로 옵니다.
      setError(msg);
      setSubmitting(false);
    }
  }

  if (!authChecked || !ready) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="h-8 w-44 animate-pulse rounded-full bg-cream-deep" />
        <div className="mt-8 h-72 animate-pulse rounded-[24px] bg-cream-deep" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <nav className="mb-4 flex items-center gap-1.5 text-[12.5px] text-ink-faint">
        <Link href="/cart" className="transition hover:text-primary">
          장바구니
        </Link>
        <span>/</span>
        <span className="font-semibold text-ink-soft">주문 · 결제</span>
      </nav>

      <h1 className="text-[28px] font-extrabold tracking-tight sm:text-[32px]">
        주문서
      </h1>
      <p className="mt-2 text-[14px] text-ink-soft">
        아이 밥이 늦지 않게, 받으실 곳을 정확히 적어주세요.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* 배송 정보 */}
          <section className="rounded-[24px] border border-line bg-surface p-6 sm:p-7">
            <h2 className="text-[16px] font-extrabold">받는 분 정보</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="받는 분" required>
                <input
                  className={inputBase}
                  value={form.ordererName}
                  onChange={set("ordererName")}
                  placeholder="김집사"
                  autoComplete="name"
                />
              </Field>
              <Field label="연락처" required>
                <input
                  className={inputBase}
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="010-1234-5678"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </Field>
              <Field label="우편번호">
                <input
                  className={inputBase}
                  value={form.postcode}
                  onChange={set("postcode")}
                  placeholder="04524"
                  inputMode="numeric"
                  autoComplete="postal-code"
                />
              </Field>
              <Field label="주소" required className="sm:col-span-2">
                <input
                  className={inputBase}
                  value={form.address}
                  onChange={set("address")}
                  placeholder="서울 중구 세종대로 110"
                  autoComplete="street-address"
                />
              </Field>
              <Field label="상세 주소" className="sm:col-span-2">
                <input
                  className={inputBase}
                  value={form.addressDetail}
                  onChange={set("addressDetail")}
                  placeholder="101동 1001호"
                />
              </Field>
              <Field label="배송 메모" className="sm:col-span-2">
                <textarea
                  className={inputBase + " min-h-[88px] resize-y"}
                  value={form.memo}
                  onChange={set("memo")}
                  placeholder="부재 시 문 앞에 놓아주세요. 초인종은 누르지 말아주세요 (고양이가 놀라요)"
                />
              </Field>
            </div>
          </section>

          {/* 결제 수단 위젯 */}
          <section className="overflow-hidden rounded-[24px] border border-line bg-surface">
            <div className="px-6 pt-6 sm:px-7">
              <h2 className="text-[16px] font-extrabold">결제 수단</h2>
              <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-ink-soft">
                <Shield size={14} className="text-sage" />
                토스페이먼츠 테스트 모드 — 실제 금액은 청구되지 않습니다.
              </p>
            </div>

            <div id="payment-method" className="mt-2 min-h-[220px]" />
            <div id="agreement" />

            {!widgetReady ? (
              <div className="px-6 pb-6 sm:px-7">
                <div className="h-40 animate-pulse rounded-2xl bg-cream-deep" />
              </div>
            ) : null}
          </section>
        </div>

        {/* 요약 */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[24px] border border-line bg-surface p-6">
            <h2 className="text-[16px] font-extrabold">주문 상품</h2>

            <ul className="mt-4 space-y-3 border-b border-line pb-4">
              {lines.map((l) => (
                <li key={l.productId} className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold">{l.name}</p>
                    <p className="text-[12px] text-ink-faint">수량 {l.qty}개</p>
                  </div>
                  <p className="shrink-0 text-[13px] font-bold">
                    {won(l.unitPrice * l.qty)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2.5">
              <div className="flex justify-between">
                <dt className="text-[13.5px] text-ink-soft">상품 금액</dt>
                <dd className="text-[13.5px] font-bold">{won(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="flex items-center gap-1.5 text-[13.5px] text-ink-soft">
                  <Truck size={14} className="text-ink-faint" />
                  배송비
                </dt>
                <dd className="text-[13.5px] font-bold">
                  {shipping === 0 ? "무료" : won(shipping)}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
              <span className="text-[14px] font-bold">총 결제금액</span>
              <span className="text-[24px] font-extrabold tracking-tight text-primary">
                {won(total)}
              </span>
            </div>

            {error ? (
              <p className="mt-4 rounded-2xl bg-primary-soft px-4 py-3 text-[12.5px] leading-relaxed text-primary-deep">
                {error}
              </p>
            ) : null}

            <button
              type="button"
              onClick={handlePay}
              disabled={!widgetReady || submitting}
              className={btnPrimary + " mt-5 w-full"}
            >
              {submitting ? "결제창을 여는 중…" : `${won(total)} 결제하기`}
            </button>

            <p className="mt-4 text-center text-[11.5px] leading-relaxed text-ink-faint">
              테스트 카드 번호는 결제창 안내를 따르면 됩니다.
              <br />
              승인되어도 실제 출금은 일어나지 않아요.
            </p>
          </div>
        </aside>
      </div>

    </div>
  );
}

function Field({
  label,
  required,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={"block " + className}>
      <span className="mb-1.5 block text-[12.5px] font-bold">
        {label}
        {required ? <span className="ml-1 text-primary">*</span> : null}
      </span>
      {children}
    </label>
  );
}
