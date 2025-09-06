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

export async function generateMetadata({ params }: { params: Promise<{ segment: string }> }): Promise<Metadata> {
  const { segment } = await params;
  const baseUrl = await getBaseUrl();
  const decodedSegment = decodeURIComponent(segment);
  const canonical = `${baseUrl}/segments/${segment}`;
  
  return {
    title: `${decodedSegment} — CEAT Україна`,
    description: `Шини CEAT для сегменту ${decodedSegment}. Високоякісні сільськогосподарські шини з офіційного складу в Україні. Швидка доставка, гарантія якості.`,
    alternates: { canonical },
    openGraph: {
      title: `${decodedSegment} — CEAT Україна`,
      description: `Шини CEAT для сегменту ${decodedSegment}. Високоякісні сільськогосподарські шини з офіційного складу в Україні.`,
      url: canonical,
      type: "website",
      siteName: "CEAT Україна",
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedSegment} — CEAT Україна`,
      description: `Шини CEAT для сегменту ${decodedSegment}. Високоякісні сільськогосподарські шини з офіційного складу в Україні.`,
    },
  };
}

export default async function Head({ params }: { params: Promise<{ segment: string }> }) {
  const { segment } = await params;
  const baseUrl = await getBaseUrl();
  const decoded = decodeURIComponent(segment);

  // ItemList JSON-LD for segment page
  type ItemForList = { id: number; product_name: string };
  let items: ItemForList[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/products/segment/${encodeURIComponent(decoded)}?limit=50`, { next: { revalidate: 300 } });
    if (res.ok) {
      const json = await res.json();
      items = ((json?.data || []) as ItemForList[]).slice(0, 50);
    }
  } catch {}

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Сегмент: ${decoded}`,
    itemListElement: items.map((p: ItemForList, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}/products/${p.id}`,
      name: p.product_name,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
