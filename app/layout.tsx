import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "지름신 억제기 | 이거 사도 될까? 결제 전에 한 번만 돌려봐",
  description: "결제 버튼 누르기 전에 30초만. 가격, 월급, 사용 빈도를 넣으면 지름신 억제기가 대신 말려드립니다.",
  verification: {
    google: "NWrNuIV-7cyS49UCtfS-k8eBkujGoaHyJL0HNxJkj_c",
  },  
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
