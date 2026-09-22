import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCategories } from "@/lib/queries";

export const metadata: Metadata = {
  title: {
    default: "캣킷 — 고양이 처방식 · 건강식 스토어",
    template: "%s | 캣킷",
  },
  description:
    "신부전, 췌장염, 피부병, 알러지, 회복식. 근거가 확인된 고양이 처방식과 건강기능식품을 질환별로 골라 담으세요.",
  keywords: [
    "고양이 처방식",
    "고양이 신부전 사료",
    "고양이 췌장염",
    "고양이 알러지 사료",
    "고양이 영양제",
  ],
  openGraph: {
    title: "캣킷 — 고양이 처방식 · 건강식 스토어",
    description:
      "아픈 고양이를 돌보는 보호자를 위해, 근거가 확인된 처방식과 건강기능식품만 모았습니다.",
    type: "website",
    locale: "ko_KR",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFBF6",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const categories = await getCategories();

  return (
    <html lang="ko" className="h-full antialiased" data-scroll-behavior="smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <Header categories={categories} />
          <main className="flex-1">{children}</main>
          <Footer categories={categories} />
        </CartProvider>
      </body>
    </html>
  );
}
