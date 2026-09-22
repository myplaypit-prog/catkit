import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * 토스페이먼츠 결제 승인.
 *
 * 흐름
 *  1. 로그인 사용자 확인
 *  2. orderId(= order_code)로 결제 전에 저장해 둔 주문을 불러온다
 *  3. **쿼리스트링의 금액이 아니라 DB에 저장된 금액**과 대조한다 (위변조 차단)
 *  4. 토스 승인 API 호출 (Basic base64(secretKey + ":"))
 *  5. 승인 결과를 주문에 기록한다
 */
export async function POST(request: Request) {
  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { message: "TOSS_SECRET_KEY 환경변수가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  let body: { paymentKey?: string; orderId?: string; amount?: number | string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "잘못된 요청입니다." }, { status: 400 });
  }

  const { paymentKey, orderId } = body;
  const clientAmount = Number(body.amount);

  if (!paymentKey || !orderId || !Number.isFinite(clientAmount)) {
    return NextResponse.json(
      { message: "결제 정보가 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { message: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  // 결제 전에 저장해 둔 주문서
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .select("id, amount, status, user_id, order_name")
    .eq("order_code", orderId)
    .maybeSingle();

  if (orderErr || !order) {
    return NextResponse.json(
      { message: "주문 내역을 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  if (order.user_id !== user.id) {
    return NextResponse.json(
      { message: "본인의 주문만 결제할 수 있습니다." },
      { status: 403 },
    );
  }

  // 이미 승인된 주문이면 그대로 성공 처리 (새로고침 대응)
  if (order.status === "paid") {
    return NextResponse.json({ alreadyPaid: true, orderId });
  }

  // 금액 위변조 검증 — 신뢰 기준은 DB에 저장된 금액입니다.
  if (order.amount !== clientAmount) {
    await supabase
      .from("orders")
      .update({ status: "failed", fail_reason: "금액 불일치" })
      .eq("id", order.id);

    return NextResponse.json(
      { message: "결제 금액이 주문 금액과 일치하지 않습니다." },
      { status: 400 },
    );
  }

  // 토스 승인 요청
  const auth = Buffer.from(secretKey + ":").toString("base64");

  const res = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: "Basic " + auth,
      "Content-Type": "application/json",
      // 같은 주문에 대한 중복 승인을 막아줍니다.
      "Idempotency-Key": "catkit-confirm-" + orderId,
    },
    body: JSON.stringify({
      paymentKey,
      orderId,
      amount: order.amount,
    }),
  });

  const payment = await res.json();

  if (!res.ok) {
    await supabase
      .from("orders")
      .update({
        status: "failed",
        fail_reason: payment?.message ?? "결제 승인 실패",
      })
      .eq("id", order.id);

    return NextResponse.json(
      {
        message: payment?.message ?? "결제 승인에 실패했습니다.",
        code: payment?.code,
      },
      { status: res.status },
    );
  }

  await supabase
    .from("orders")
    .update({
      status: "paid",
      payment_key: payment.paymentKey,
      method: payment.method ?? null,
      receipt_url: payment.receipt?.url ?? null,
      approved_at: payment.approvedAt ?? new Date().toISOString(),
    })
    .eq("id", order.id);

  return NextResponse.json({
    orderId,
    orderName: order.order_name,
    amount: order.amount,
    method: payment.method ?? null,
    approvedAt: payment.approvedAt ?? null,
    receiptUrl: payment.receipt?.url ?? null,
  });
}
