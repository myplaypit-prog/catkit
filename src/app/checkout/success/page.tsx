"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { CatFace } from "@/components/icons/CatArt";
import { Check, External } from "@/components/icons/Ico";
import { btnGhost, btnPrimary } from "@/components/ui";
import { won } from "@/lib/format";

type Result = {
  orderId: string;
  orderName?: string;
  amount?: number;
  method?: string | null;
  approvedAt?: string | null;
  receiptUrl?: string | null;
  alreadyPaid?: boolean;
};

export default function SuccessPage() {
  return (
    <Suspense fallback={<Pending />}>
      <SuccessInner />
    </Suspense>
  );
}

function SuccessInner() {
  const sp = useSearchParams();
  const { clear } = useCart();
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [result, setResult] = useState<Result | null>(null);
  const [message, setMessage] = useState("");
  const onceRef = useRef(false);

  // 파라미터 검증은 렌더 중에 끝냅니다 — effect 안에서 setState 할 이유가 없습니다.
  const paymentKey = sp.get("paymentKey");
  const orderId = sp.get("orderId");
  const amount = sp.get("amount");
  const paramsMissing = !paymentKey || !orderId || !amount;

  useEffect(() => {
    if (paramsMissing) return;
    if (onceRef.current) return;
    onceRef.current = true;

    (async () => {
      try {
        const res = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
        });
        const data = await res.json();

        if (!res.ok) {
          setState("error");
          setMessage(data?.message ?? "결제 승인에 실패했습니다.");
          return;
        }

        setResult({ ...data, orderId });
        setState("ok");
        clear();
      } catch {
        setState("error");
        setMessage("서버와 통신하지 못했습니다. 잠시 후 주문 내역을 확인해 주세요.");
      }
    })();
  }, [paramsMissing, paymentKey, orderId, amount, clear]);

  if (state === "loading" && !paramsMissing) return <Pending />;

  if (state === "error" || paramsMissing) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <CatFace fur="grey" mood="sleepy" size={110} className="mx-auto" />
        <h1 className="mt-6 text-[24px] font-extrabold">
          결제를 마무리하지 못했어요
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
          {paramsMissing ? "결제 정보가 전달되지 않았습니다." : message}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          <Link href="/cart" className={btnPrimary}>
            장바구니로 돌아가기
          </Link>
          <Link href="/orders" className={btnGhost}>
            주문 내역 확인
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <div className="text-center">
        <div className="relative mx-auto w-fit">
          <CatFace fur="cream" mood="happy" size={124} />
          <span className="absolute -right-1 bottom-1 grid h-10 w-10 place-items-center rounded-full bg-sage text-white shadow-[var(--shadow-soft)]">
            <Check size={22} strokeWidth={3} />
          </span>
        </div>
        <h1 className="mt-6 text-[26px] font-extrabold tracking-tight">
          결제가 완료됐어요
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
          주문해 주셔서 고맙습니다. 아이 밥이 늦지 않게 준비해서 보내드릴게요.
        </p>
      </div>

      <div className="mt-8 rounded-[24px] border border-line bg-surface p-6">
        <dl className="space-y-3">
          <Row label="주문번호" value={result?.orderId ?? "-"} mono />
          {result?.orderName ? (
            <Row label="주문 상품" value={result.orderName} />
          ) : null}
          {typeof result?.amount === "number" ? (
            <Row label="결제 금액" value={won(result.amount)} strong />
          ) : null}
          {result?.method ? <Row label="결제 수단" value={result.method} /> : null}
        </dl>

        {result?.receiptUrl ? (
          <a
            href={result.receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-primary transition hover:underline"
          >
            영수증 보기
            <External size={14} />
          </a>
        ) : null}

        <p className="mt-5 rounded-2xl bg-cream-deep/60 px-4 py-3 text-[12px] leading-relaxed text-ink-soft">
          토스페이먼츠 테스트 결제입니다. 승인 기록은 남지만 실제 금액은
          청구되지 않으며, 상품도 배송되지 않습니다.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        <Link href="/orders" className={btnPrimary}>
          주문 내역 보기
        </Link>
        <Link href="/products" className={btnGhost}>
          계속 둘러보기
        </Link>
      </div>
    </div>
  );
}

function Pending() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <CatFace fur="calico" mood="curious" size={110} className="mx-auto animate-floaty" />
      <h1 className="mt-6 text-[22px] font-extrabold">결제를 확인하고 있어요</h1>
      <p className="mt-2.5 text-[14px] text-ink-soft">
        창을 닫지 말고 잠시만 기다려 주세요.
      </p>
      <div className="mx-auto mt-7 h-1.5 w-48 overflow-hidden rounded-full bg-line">
        <div className="h-full w-1/3 animate-[rise_1.2s_ease-in-out_infinite] rounded-full bg-primary" />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  strong,
}: {
  label: string;
  value: string;
  mono?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-[13px] text-ink-soft">{label}</dt>
      <dd
        className={
          "text-right text-[13.5px] font-bold " +
          (mono ? "break-all font-mono text-[12px] " : "") +
          (strong ? "text-[16px] text-primary" : "")
        }
      >
        {value}
      </dd>
    </div>
  );
}
