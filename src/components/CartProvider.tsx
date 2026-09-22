"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { CartLine } from "@/lib/types";
import { shippingFor } from "@/lib/format";

const STORAGE_KEY = "catkit.cart.v1";

/* ══════════════════════════════════════════════════════════
   localStorage 를 외부 스토어로 다루는 장바구니.

   useEffect 로 읽어와 setState 하면 hydration 직후 한 번 더 렌더가
   돌고, 그 사이 "장바구니가 비었어요" 가 잠깐 보입니다.
   useSyncExternalStore 를 쓰면 React 가 서버 스냅샷과 클라이언트
   스냅샷을 알아서 맞춰주므로 그 깜빡임과 연쇄 렌더가 사라집니다.
   ══════════════════════════════════════════════════════════ */

const EMPTY: CartLine[] = [];

/** 클라이언트 쪽 단일 진실. null 이면 아직 localStorage 를 안 읽은 상태 */
let snapshot: CartLine[] | null = null;
const listeners = new Set<() => void>();

function parse(raw: string | null): CartLine[] {
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartLine[]) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function emit() {
  listeners.forEach((l) => l());
}

/** 다른 탭에서 담은 상품도 반영 */
function onStorage(e: StorageEvent) {
  if (e.key !== STORAGE_KEY) return;
  snapshot = parse(e.newValue);
  emit();
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): CartLine[] {
  if (snapshot === null) {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      /* 프라이빗 모드 등으로 막혀 있으면 빈 장바구니로 시작합니다 */
    }
    snapshot = parse(raw);
  }
  return snapshot;
}

function getServerSnapshot(): CartLine[] {
  return EMPTY;
}

/**
 * 저장에 실패해도 메모리 스냅샷은 갱신합니다.
 * 저장 공간이 막혀 있어도 이번 세션 동안은 장바구니가 동작해야 하니까요.
 */
function write(next: CartLine[]) {
  snapshot = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* 무시 */
  }
  emit();
}

function update(fn: (prev: CartLine[]) => CartLine[]) {
  write(fn(getSnapshot()));
}

/* hydration 완료 여부도 같은 방식으로 — 서버에서는 false, 클라이언트에서는 true */
const subscribeNever = () => () => {};
const alwaysTrue = () => true;
const alwaysFalse = () => false;

/* ────────────────────────────────────────────────────────── */

type CartContextValue = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (productId: number, qty: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(subscribeNever, alwaysTrue, alwaysFalse);

  const add = useCallback((line: Omit<CartLine, "qty">, qty = 1) => {
    update((prev) => {
      const found = prev.find((l) => l.productId === line.productId);
      if (found) {
        return prev.map((l) =>
          l.productId === line.productId
            ? { ...l, qty: Math.min(99, l.qty + qty) }
            : l,
        );
      }
      return [...prev, { ...line, qty }];
    });
  }, []);

  const setQty = useCallback((productId: number, qty: number) => {
    update((prev) =>
      qty <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) =>
            l.productId === productId ? { ...l, qty: Math.min(99, qty) } : l,
          ),
    );
  }, []);

  const remove = useCallback((productId: number) => {
    update((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const clear = useCallback(() => write(EMPTY), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
    const shipping = shippingFor(subtotal);
    return {
      lines,
      ready,
      count,
      subtotal,
      shipping,
      total: subtotal + shipping,
      add,
      setQty,
      remove,
      clear,
    };
  }, [lines, ready, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart는 CartProvider 안에서만 사용할 수 있습니다.");
  return ctx;
}
