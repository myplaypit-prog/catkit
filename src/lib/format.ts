export function won(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

export function wonShort(n: number) {
  return n.toLocaleString("ko-KR");
}

export function discountRate(price: number, sale: number | null) {
  if (!sale || sale >= price) return 0;
  return Math.round(((price - sale) / price) * 100);
}

export function finalPrice(price: number, sale: number | null) {
  return sale && sale < price ? sale : price;
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "." + mm + "." + dd;
}

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return formatDate(iso) + " " + hh + ":" + mi;
}

/**
 * 주문번호. 결제완료 · 결제실패 · 주문내역 화면에 그대로 노출되므로
 * 브랜드(무병장수)를 따릅니다. 토스 orderId 규격은 영문/숫자/-/_/= 6~64자.
 */
export function makeOrderCode() {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 8).toUpperCase();
  return "MBJS-" + t + "-" + r;
}

/** 문자열을 안정적인 0~n-1 정수로 (일러스트 배정용) */
export function hashIndex(seed: string, n: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return h % n;
}

export const SHIPPING_FEE = 3000;
export const FREE_SHIPPING_OVER = 50000;

export function shippingFor(subtotal: number) {
  if (subtotal === 0) return 0;
  return subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
}
