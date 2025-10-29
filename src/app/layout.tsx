import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";
import I18nProvider from "@/providers/I18nProvider";
import { cookies } from "next/headers";
import { getDictionary } from "@/i18n";
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
  title: "Грузовые шины Грузии | Премиальные шины",
  description:
    "Грузовые шины Грузии — надежные шины и сервис. Магазин шин для грузовиков и прицепов.",
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
    siteName: "Грузовые шины Грузии",
    title: "Грузовые шины Грузии | Премиальные шины",
    description: "Грузовые шины Грузии — надежные шины и сервис. Магазин шин для грузовиков и прицепов.",
    images: [
      {
        url: "/cstl-logo-eu-as.avif",
        width: 1200,
        height: 630,
        alt: "Грузовые шины Грузии",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Грузовые шины Грузии | Премиальные шины",
    description: "Грузовые шины Грузии — надежные шины и сервис. Магазин шин для грузовиков и прицепов.",
    images: ["/cstl-logo-eu-as.avif"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#008e4ed3",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("lang")?.value as "ru" | "ka" | undefined;
  const lang = langCookie === "ka" ? "ka" : "ru";
  const dict = await getDictionary(lang);
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider>
          <I18nProvider lang={lang} dict={dict}>
            <Header />
            <main className="flex-1 pt-[73px]">{children}</main>
            <Footer />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
