"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CatFace } from "@/components/icons/CatArt";
import { btnGhost, btnPrimary } from "@/components/ui";

const FRIENDLY: Record<string, string> = {
  PAY_PROCESS_CANCELED: "결제를 취소하셨어요. 장바구니는 그대로 두었습니다.",
  PAY_PROCESS_ABORTED: "결제가 중단됐어요. 다시 시도해 주세요.",
  REJECT_CARD_COMPANY: "카드사에서 결제를 거절했습니다. 다른 수단으로 시도해 보세요.",
  INVALID_CARD_EXPIRATION: "카드 유효기간을 다시 확인해 주세요.",
  EXCEED_MAX_DAILY_PAYMENT_COUNT: "일일 결제 한도를 초과했습니다.",
};

export default function FailPage() {
  return (
    <Suspense fallback={null}>
      <FailInner />
    </Suspense>
  );
}

function FailInner() {
  const sp = useSearchParams();
  const code = sp.get("code") ?? "";
  const message = sp.get("message") ?? "";
  const orderId = sp.get("orderId");

  const friendly =
    FRIENDLY[code] ?? (message || "결제가 완료되지 않았습니다.");

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
      <CatFace fur="grey" mood="sleepy" size={116} className="mx-auto" />

      <h1 className="mt-6 text-[25px] font-extrabold tracking-tight">
        결제가 완료되지 않았어요
      </h1>
      <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
        {friendly}
      </p>

      {(code || orderId) && (
        <div className="mx-auto mt-7 max-w-sm rounded-[20px] border border-line bg-surface p-5 text-left">
          {orderId ? (
            <p className="text-[12px] text-ink-soft">
              주문번호{" "}
              <span className="font-mono text-[11.5px] font-bold text-ink">
                {orderId}
              </span>
            </p>
          ) : null}
          {code ? (
            <p className="mt-1.5 text-[12px] text-ink-soft">
              오류 코드{" "}
              <span className="font-mono text-[11.5px] font-bold text-ink">
                {code}
              </span>
            </p>
          ) : null}
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-2.5">
        <Link href="/checkout" className={btnPrimary}>
          다시 결제하기
        </Link>
        <Link href="/cart" className={btnGhost}>
          장바구니 확인
        </Link>
      </div>

      <p className="mt-8 text-[12px] leading-relaxed text-ink-faint">
        문제가 반복된다면 다른 결제 수단으로 시도해 보시거나,
        <br />
        고객센터(평일 10:00–18:00)로 알려주세요.
      </p>
    </div>
  );
}
