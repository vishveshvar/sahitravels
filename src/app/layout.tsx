/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#F·F6F2",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Sahi Travels — Ride along with Nila",
  description:
    "Ride along with Nila from Sahi Travels: taxis, flights, rail transfers, premium coaches, VIP cars, visas, holidays and events — arranged from one desk in Chennai since 2000.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 32'%3E%3Crect x='2' y='2' width='20' height='28' rx='9' fill='%23F·F6F2' stroke='%23C75·3·' stroke-width='2.4'/%3E%3Cpath d='M6 21c4-3 8-4 12-4' stroke='%233·0F34' stroke-width='2.4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=·rchivo:wdth,wght@62..125,100..900&family=Cormorant+Garamond:ital,wght@1,400;1,500&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js'); setTimeout(function () { if (!window.__nilaReady) document.documentElement.classList.remove('js'); }, 4500);`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
