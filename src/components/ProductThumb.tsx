import Image from "next/image";
import type { ProductKind } from "@/lib/types";

/**
 * 상품 예시 이미지.
 *
 * 실제 제품 사진 대신 제형(건사료 / 습식 / 영양제)별 대표 컷을 씁니다.
 * 카테고리 색을 아주 옅게 얹어 목록에서 질환 구분이 남도록 했습니다.
 * 원본은 1254px 정사각이지만 카드가 4:3이라 같은 비율로 여백을 채워
 * 내보냈기 때문에 object-cover 로도 패키지가 잘리지 않습니다.
 */

const SRC: Record<ProductKind, string> = {
  dry: "/illustrations/products/dry.webp",
  wet: "/illustrations/products/wet.webp",
  supplement: "/illustrations/products/supplement.webp",
};

const ALT: Record<ProductKind, string> = {
  dry: "크림빛 패키지의 고양이 건사료와 사료가 담긴 그릇",
  wet: "고양이 습식 파우치와 캔, 그릇에 담긴 습식 사료",
  supplement: "고양이 영양제 드롭 보틀과 캡슐 통",
};

export function ProductThumb({
  kind,
  accent = "#C85F3D",
  className = "",
  compact = false,
  priority = false,
}: {
  kind: ProductKind;
  accent?: string | null;
  className?: string;
  /** 장바구니 · 주문 내역처럼 작게 쓰는 자리 */
  compact?: boolean;
  priority?: boolean;
}) {
  const color = accent ?? "#C85F3D";

  return (
    <div className={"relative overflow-hidden bg-cream-deep " + className}>
      <Image
        src={SRC[kind]}
        alt={compact ? "" : ALT[kind]}
        aria-hidden={compact || undefined}
        fill
        priority={priority}
        sizes={
          compact
            ? "96px"
            : "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 380px"
        }
        className="object-cover"
      />

      {/* 질환 색 워시 — 사진을 해치지 않을 만큼만 */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(140deg, ${color}26 0%, ${color}0D 42%, transparent 70%)`,
        }}
      />
    </div>
  );
}
