import type { Metadata } from "next";
import { headers } from "next/headers";

async function getBaseUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getBaseUrl();
  const canonical = `${baseUrl}/news`;
  return {
    title: "Новини та статті — CEAT — офіційний імпортер в Україні",
    description: "Огляди новинок серед сільськогосподарських шин, поради з вибору та експлуатації, корисні лайфхаки для аграріїв. Ваше надійне джерело знань про с/г шини.",
    alternates: { canonical },
    openGraph: {
      title: "Новини та статті — CEAT — офіційний імпортер в Україні",
      description: "Огляди новинок серед сільськогосподарських шин, поради з вибору та експлуатації, корисні лайфхаки для аграріїв. Ваше надійне джерело знань про с/г шини.",
      url: canonical,
      type: "website",
      siteName: "CEAT — офіційний імпортер в Україні",
    },
    twitter: {
      card: "summary_large_image",
      title: "Новини та статті — CEAT — офіційний імпортер в Україні",
      description: "Огляди новинок серед сільськогосподарських шин, поради з вибору та експлуатації, корисні лайфхаки для аграріїв. Ваше надійне джерело знань про с/г шини.",
    },
  };
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
