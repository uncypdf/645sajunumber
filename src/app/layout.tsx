import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "사주기반 운명로또번호 생성기 | 645사주넘버",
    template: "%s | 645사주넘버",
  },
  description: "당신의 사주에 기반한 운명의 숫자를 알려드립니다.",
  metadataBase: new URL("https://www.645sajunumber.com"),
  // IMPORTANT: do NOT set a global canonical to "/".
  // Each page should define its own canonical (otherwise Google treats pages as duplicates of /).
  openGraph: {
    title: "사주기반 운명로또번호 생성기 | 645사주넘버",
    description: "당신의 사주에 기반한 운명의 숫자를 알려드립니다.",
    siteName: "645사주넘버",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-061K68EYBC"
          strategy="afterInteractive"
        />
        <Script id="ga4-gtag" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-061K68EYBC');`}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
