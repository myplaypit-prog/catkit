import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProductsByIds } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { Empty, btnPrimary } from "@/components/ui";
import { Heart } from "@/components/icons/Ico";

export const metadata: Metadata = {
  title: "찜한 상품",
  description: "나중에 다시 보려고 담아둔 처방식과 건강기능식품.",
};

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/wishlist");

  // RLS 가 내 것만 돌려주므로 user_id 조건은 따로 걸지 않습니다
  const { data: rows } = await supabase
    .from("wishlists")
    .select("product_id")
    .order("created_at", { ascending: false });

  const ids = (rows ?? []).map((r) => r.product_id as number);
  const products = await getProductsByIds(ids);

  // 찜한 순서(최신순)를 유지합니다
  const byId = new Map(products.map((p) => [p.id, p]));
  const ordered = ids.map((id) => byId.get(id)).filter((p) => p !== undefined);

  // 판매 중지된 상품은 카탈로그 조회에서 빠집니다
  const missing = ids.length - ordered.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="mb-4 flex items-center gap-1.5 text-[12.5px] text-ink-faint">
        <Link href="/" className="transition hover:text-primary">
          홈
        </Link>
        <span>/</span>
        <span className="font-semibold text-ink-soft">찜한 상품</span>
      </nav>

      <header className="mb-8">
        <h1 className="flex items-center gap-2 text-[28px] font-extrabold tracking-tight sm:text-[32px]">
          <Heart size={26} filled className="text-primary" />
          찜한 상품
        </h1>
        <p className="mt-2 text-[14px] text-ink-soft">
          {ordered.length > 0
            ? `${ordered.length}개를 담아두셨어요. 가격이 바뀌어도 여기서 바로 확인하실 수 있습니다.`
            : "나중에 다시 보고 싶은 상품을 모아두는 곳입니다."}
        </p>
      </header>

      {ordered.length === 0 ? (
        <Empty
          title="아직 찜한 상품이 없어요"
          desc="상품 카드나 상세 페이지의 하트를 누르면 여기에 모입니다. 처방식을 고르다 망설여지는 게 있으면 일단 담아두세요."
          action={
            <Link href="/products" className={btnPrimary}>
              처방식 둘러보기
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {ordered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {missing > 0 ? (
            <p className="mt-6 rounded-2xl border border-line bg-surface px-5 py-4 text-[12.5px] leading-relaxed text-ink-soft">
              찜해두신 상품 {missing}개는 현재 판매하지 않아 표시되지 않습니다.
              다시 입고되면 이 목록에 자동으로 나타납니다.
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}
