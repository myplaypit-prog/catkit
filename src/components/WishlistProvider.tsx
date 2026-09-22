"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

/* ══════════════════════════════════════════════════════════
   찜하기.

   장바구니와 달리 계정에 붙는 데이터라 Supabase 에 저장합니다.
   (주문 · 상담과 같은 성격 — 기기를 바꿔도 남아야 합니다)

   화면에서는 하트가 곧바로 반응해야 하므로 낙관적으로 먼저 바꾸고,
   서버가 실패하면 되돌립니다.
   ══════════════════════════════════════════════════════════ */

type WishlistContextValue = {
  /** 로그인 확인과 첫 조회가 끝났는지 */
  ready: boolean;
  signedIn: boolean;
  ids: ReadonlySet<number>;
  count: number;
  has: (productId: number) => boolean;
  /** 담기/빼기. 로그인 안 했으면 false 를 돌려줍니다 */
  toggle: (productId: number) => Promise<boolean>;
  remove: (productId: number) => Promise<boolean>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [ids, setIds] = useState<ReadonlySet<number>>(() => new Set());

  useEffect(() => {
    const supabase = createClient();
    let alive = true;

    async function load(nextUser: User | null) {
      if (!nextUser) {
        if (alive) {
          setUser(null);
          setIds(new Set());
          setReady(true);
        }
        return;
      }
      const { data } = await supabase
        .from("wishlists")
        .select("product_id")
        .order("created_at", { ascending: false });

      if (!alive) return;
      setUser(nextUser);
      setIds(new Set((data ?? []).map((r) => r.product_id as number)));
      setReady(true);
    }

    supabase.auth.getUser().then(({ data }) => load(data.user ?? null));

    // 로그인/로그아웃하면 찜 목록도 따라가야 합니다
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setReady(false);
      load(session?.user ?? null);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const has = useCallback((productId: number) => ids.has(productId), [ids]);

  const write = useCallback(
    async (productId: number, next: boolean) => {
      if (!user) return false;

      const prev = ids;
      const optimistic = new Set(prev);
      if (next) optimistic.add(productId);
      else optimistic.delete(productId);
      setIds(optimistic);

      const supabase = createClient();
      const { error } = next
        ? await supabase
            .from("wishlists")
            .upsert(
              { user_id: user.id, product_id: productId },
              { onConflict: "user_id,product_id" },
            )
        : await supabase
            .from("wishlists")
            .delete()
            .eq("user_id", user.id)
            .eq("product_id", productId);

      if (error) {
        setIds(prev); // 실패하면 되돌립니다
        return false;
      }
      return true;
    },
    [user, ids],
  );

  const toggle = useCallback(
    (productId: number) => write(productId, !ids.has(productId)),
    [write, ids],
  );

  const remove = useCallback(
    (productId: number) => write(productId, false),
    [write],
  );

  const value = useMemo<WishlistContextValue>(
    () => ({
      ready,
      signedIn: !!user,
      ids,
      count: ids.size,
      has,
      toggle,
      remove,
    }),
    [ready, user, ids, has, toggle, remove],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist는 WishlistProvider 안에서만 사용할 수 있습니다.");
  }
  return ctx;
}
