import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ceat-katalog.vercel.app'),
  title: "CEAT — офіційний імпортер в Україні | Сільськогосподарські шини",
  description:
    "CEAT — офіційний імпортер в Україні. Магазин шин для тракторів, комбайнів, навантажувачів, обприскувачів та причепів.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/icon0.svg", sizes: "any", type: "image/svg+xml" },
      { url: "/icon1.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  robots: "index, follow",
  openGraph: {
    type: "website",
    siteName: "CEAT — офіційний імпортер в Україні",
    title: "CEAT — офіційний імпортер в Україні | Сільськогосподарські шини",
    description: "CEAT — офіційний імпортер в Україні. Каталог шин для тракторів, комбайнів, навантажувачів, обприскувачів та причепів.",
    images: [
      {
        url: "/cstl-logo-eu-as.avif",
        width: 1200,
        height: 630,
        alt: "CEAT — офіційний імпортер в Україні",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CEAT — офіційний імпортер в Україні | Сільськогосподарські шини",
    description: "CEAT — офіційний імпортер в Україні. Каталог шин для тракторів, комбайнів, навантажувачів, обприскувачів та причепів.",
    images: ["/cstl-logo-eu-as.avif"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#008e4ed3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider>
          <Header />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
