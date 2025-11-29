import type { Metadata } from "next";
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

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://permiflow-example.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "PermiFlow — Captez le pouls de la ville",
    template: "%s | PermiFlow",
  },
  description:
    "PermiFlow analyse les permis de construire et permet de suivre les dynamiques urbaines ou de parier sur leur évolution.",
  keywords: [
    "PermiFlow",
    "permis de construire",
    "ville",
    "pari urbain",
    "supabase",
    "stripe",
  ],
  manifest: "/manifest.json",
  themeColor: "#1E3A8A",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icons/icon-192.png", sizes: "192x192" },
      { url: "/icons/icon-512.png", sizes: "512x512" },
    ],
    apple: "/icons/icon-192.png",
  },
  openGraph: {
    title: "PermiFlow — Captez le pouls de la ville",
    description:
      "Mappez les tendances urbaines, placez des paris et suivez vos gains.",
    url: APP_URL,
    siteName: "PermiFlow",
    images: [
      {
        url: "/og-permiflow.png",
        width: 1200,
        height: 630,
        alt: "Carte PermiFlow",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PermiFlow — Captez le pouls de la ville",
    description:
      "La PWA qui capture le rythme immobilier grâce aux permis de construire.",
    images: ["/og-permiflow.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}
