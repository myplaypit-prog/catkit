import Link from "next/link";
import type { Category } from "@/lib/types";
import { CatMark } from "./icons/CatArt";

export function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer className="mt-24 border-t border-line bg-cream-deep/60">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <CatMark size={32} />
              <span className="text-[18px] font-extrabold tracking-tight">캣킷</span>
            </Link>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-ink-soft">
              아픈 고양이를 돌보는 일은 외롭습니다. 캣킷은 근거가 확인된 처방식과
              건강기능식품만 골라, 왜 그런지까지 함께 적어 둡니다.
            </p>
            <p className="mt-4 text-[12px] leading-relaxed text-ink-faint">
              평일 10:00 – 18:00 · 점심 13:00 – 14:00
              <br />
              주말 · 공휴일 휴무
            </p>
          </div>

          <FooterCol title="질환별 처방식">
            {categories.map((c) => (
              <FooterLink key={c.slug} href={`/categories/${c.slug}`}>
                {c.name}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="둘러보기">
            <FooterLink href="/products">처방식 전체</FooterLink>
            <FooterLink href="/supplements">건강기능식품</FooterLink>
            <FooterLink href="/products?rx=rx">처방전 필요 상품</FooterLink>
            <FooterLink href="/cart">장바구니</FooterLink>
            <FooterLink href="/orders">주문 내역</FooterLink>
          </FooterCol>

          <FooterCol title="함께 돌보기">
            <FooterLink href="/vets">전문 수의사 상담</FooterLink>
            <FooterLink href="/clinics">우리 동네 동물병원</FooterLink>
            <FooterLink href="/login">로그인 · 회원가입</FooterLink>
          </FooterCol>
        </div>

        <div className="mt-12 rounded-[20px] border border-line bg-surface/70 p-5">
          <p className="text-[12px] font-bold text-ink-soft">
            꼭 확인해 주세요
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-ink-faint">
            캣킷에 실린 상품 설명과 근거 자료는 보호자의 이해를 돕기 위한
            참고 정보이며, 수의사의 진단과 처방을 대신하지 않습니다. 처방식으로
            표시된 상품은 반드시 담당 수의사와 상의한 뒤 급여해 주세요. 상태가
            갑자기 나빠졌다면 온라인 상담보다 가까운 병원 방문이 먼저입니다.
          </p>
          <p className="mt-3 text-[12px] leading-relaxed text-ink-faint">
            이 사이트는 학습·시연 목적으로 만들어진 데모입니다. 수의사·동물병원
            정보와 후기는 실제 인물·기관이 아닌 예시 데이터이며, 결제는
            토스페이먼츠 테스트 키로 동작해 실제 금액이 청구되지 않습니다.
          </p>
        </div>

        <p className="mt-8 text-[12px] text-ink-faint">
          © {new Date().getFullYear()} catkit — 고양이 처방식 · 건강식 스토어
        </p>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-3 text-[13px] font-bold">{title}</p>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-[13px] text-ink-soft transition hover:text-primary"
      >
        {children}
      </Link>
    </li>
  );
}
