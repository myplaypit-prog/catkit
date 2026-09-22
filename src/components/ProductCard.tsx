import Link from "next/link";
import type { ProductWithRefs } from "@/lib/types";
import { discountRate, finalPrice, won } from "@/lib/format";
import { KIND_LABEL, LIFE_STAGE_SHORT, SUPP_LABEL } from "@/lib/labels";
import { Badge, Rating, RxBadge } from "./ui";
import { ProductThumb } from "./ProductThumb";
import { AddToCartMini } from "./AddToCart";

export function ProductCard({
  product,
  showCategory = true,
}: {
  product: ProductWithRefs;
  showCategory?: boolean;
}) {
  const price = finalPrice(product.price, product.sale_price);
  const off = discountRate(product.price, product.sale_price);
  const accent = product.accent ?? product.category?.accent ?? "#B9502F";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-surface shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-[var(--shadow-lift)] sm:rounded-[24px]">
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[4/3] w-full">
          <ProductThumb
            kind={product.kind}
            accent={accent}
            className="h-full w-full"
          />
          <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5 sm:left-3 sm:top-3">
            {product.rx_required ? <RxBadge /> : null}
            {off > 0 ? (
              <Badge fg="#FFFFFF" bg="#B9502F">
                {off}%
              </Badge>
            ) : null}
          </div>
        </div>

        {/* 모바일 2열에서도 읽히도록 여백·타입 스케일을 한 단계 낮춤 */}
        <div className="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {showCategory && product.category ? (
              <Badge
                fg={product.category.accent}
                bg={product.category.accent_soft}
              >
                {product.category.name}
              </Badge>
            ) : null}
            <Badge>{KIND_LABEL[product.kind]}</Badge>
            {/*
              숨김은 래퍼에 겁니다. Badge 안의 inline-flex 와 hidden 은 둘 다
              display 유틸이라, className 으로 hidden 을 넘기면 Tailwind 가
              나중에 출력하는 inline-flex 에 밀려 모바일에서도 그대로 보입니다.
            */}
            {product.kind === "supplement" && product.supplement_kind ? (
              <span className="hidden sm:contents">
                <Badge>{SUPP_LABEL[product.supplement_kind]}</Badge>
              </span>
            ) : null}
          </div>

          <p className="truncate text-[11.5px] font-semibold text-ink-faint sm:text-[12px]">
            {product.brand?.name}
            {product.unit_label ? " · " + product.unit_label : ""}
          </p>

          <h3 className="text-[14px] font-bold leading-snug transition group-hover:text-primary sm:text-[15px]">
            {product.name}
          </h3>

          <p className="line-clamp-2 text-[12px] leading-relaxed text-ink-soft sm:text-[13px]">
            {product.short_desc}
          </p>

          <div className="mt-auto flex flex-col gap-1 pt-2 sm:flex-row sm:items-end sm:justify-between sm:gap-2">
            <div className="order-2 sm:order-1">
              {off > 0 ? (
                <p className="text-[11.5px] text-ink-faint line-through sm:text-[12px]">
                  {won(product.price)}
                </p>
              ) : null}
              <p className="text-[16px] font-extrabold tracking-tight sm:text-[17px]">
                {won(price)}
              </p>
            </div>
            <div className="order-1 flex items-center justify-between gap-2 sm:order-2 sm:flex-col sm:items-end sm:gap-1">
              <Rating value={product.rating} count={product.review_count} />
              <span className="text-[11px] text-ink-faint">
                {LIFE_STAGE_SHORT[product.life_stage]}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="border-t border-line p-2.5 sm:p-3">
        <AddToCartMini product={product} />
      </div>
    </article>
  );
}
