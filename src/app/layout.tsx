import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jun MVP Starter",
  description:
    "Go production in minutes with Next.js, Line Login, and Firebase",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://jun-mvp-starter.web.app"
  ),
  openGraph: {
    type: "website",
    title: "Jun MVP Starter",
    description:
      "Go production in minutes with Next.js, Line Login, and Firebase",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "Jun MVP Starter - Go production in minutes",
      },
    ],
    siteName: "Jun MVP Starter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jun MVP Starter",
    description:
      "Go production in minutes with Next.js, Line Login, and Firebase",
    images: ["/banner.png"],
    creator: "@siriwatknp",
  },
  other: {
    "line:card": "summary_large_image",
    "line:title": "Jun MVP Starter",
    "line:description":
      "Go production in minutes with Next.js, Line Login, and Firebase",
    "line:image": "/banner.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense>
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
