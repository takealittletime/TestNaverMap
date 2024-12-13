import "@/styles/globals.css";

import type { Metadata } from "next";
import Script from "next/script";

import { cn } from "@/lib/clsx";
import { SpoqaHanSansNeo } from "@/styles/font";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={SpoqaHanSansNeo.variable}>
      <head>
        <Script
          strategy="beforeInteractive"
          src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        />
      </head>
      <body className={cn("font-spoqa-han-sans-neo", "w-full", "h-dvh")}>
        {children}
      </body>
    </html>
  );
}
