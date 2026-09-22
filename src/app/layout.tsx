import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCategories } from "@/lib/queries";

export const metadata: Metadata = {
  title: {
    default: "캣킷 — 믿을 수 있는 고양이 건강 큐레이션",
    template: "%s | 캣킷",
  },
  description:
    "아이가 나와 함께 오래도록, 건강하게. 근거를 확인한 고양이 처방식과 건강기능식품을 먼저 고릅니다.",
  keywords: [
    "고양이 처방식",
    "고양이 신부전 사료",
    "고양이 췌장염",
    "고양이 알러지 사료",
    "고양이 영양제",
  ],
  openGraph: {
    title: "캣킷 — 믿을 수 있는 고양이 건강 큐레이션",
    description:
      "아이가 나와 함께 오래도록, 건강하게. 믿을 수 있는 제품을 먼저.",
    type: "website",
    locale: "ko_KR",
  },
};

export const viewport: Viewport = {
  themeColor: "#FCF8F1",
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
