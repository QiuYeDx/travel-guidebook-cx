import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MobileTripNavigation } from "@/components/layout/mobile-trip-navigation";
import { AppProviders } from "@/components/providers/app-providers";
import { siteConfig } from "@/config/site";
import { chuanxiTrip } from "@/data/trips/2026-chuanxi/trip";

const tripModeConfig = {
  tripId: chuanxiTrip.id,
  timezone: chuanxiTrip.timezone,
  startDate: chuanxiTrip.startDate,
  endDate: chuanxiTrip.endDate,
  days: chuanxiTrip.days.map(({ id, date, title }) => ({ id, date, title })),
};

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
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.shortName,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <AppProviders tripModeConfig={tripModeConfig}>
          <SiteHeader />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <SiteFooter />
          <MobileTripNavigation />
        </AppProviders>
      </body>
    </html>
  );
}
