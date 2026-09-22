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
  const accent = product.accent ?? product.category?.accent ?? "#E07A46";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-surface shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-[var(--shadow-lift)]">
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[4/3] w-full">
          <ProductThumb
            kind={product.kind}
            accent={accent}
            className="h-full w-full"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {product.rx_required ? <RxBadge /> : null}
            {off > 0 ? (
              <Badge fg="#FFFFFF" bg="#E07A46">
                {off}%
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
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
            {product.kind === "supplement" && product.supplement_kind ? (
              <Badge>{SUPP_LABEL[product.supplement_kind]}</Badge>
            ) : null}
          </div>

          <p className="text-[12px] font-semibold text-ink-faint">
            {product.brand?.name}
            {product.unit_label ? " · " + product.unit_label : ""}
          </p>

          <h3 className="text-[15px] font-bold leading-snug transition group-hover:text-primary">
            {product.name}
          </h3>

          <p className="line-clamp-2 text-[13px] leading-relaxed text-ink-soft">
            {product.short_desc}
          </p>

          <div className="mt-auto flex items-end justify-between gap-2 pt-2">
            <div>
              {off > 0 ? (
                <p className="text-[12px] text-ink-faint line-through">
                  {won(product.price)}
                </p>
              ) : null}
              <p className="text-[17px] font-extrabold tracking-tight">
                {won(price)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Rating value={product.rating} count={product.review_count} />
              <span className="text-[11px] text-ink-faint">
                {LIFE_STAGE_SHORT[product.life_stage]}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="border-t border-line p-3">
        <AddToCartMini product={product} />
      </div>
    </article>
  );
}
