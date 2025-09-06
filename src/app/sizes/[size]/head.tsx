import type { Metadata } from "next";
import { headers } from "next/headers";

async function getBaseUrl(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function generateMetadata({ params }: { params: Promise<{ size: string }> }): Promise<Metadata> {
  const { size } = await params;
  const baseUrl = await getBaseUrl();
  const decodedSize = decodeURIComponent(size);
  const canonical = `${baseUrl}/sizes/${size}`;

  return {
    title: `Шини розміру ${decodedSize} — CEAT Україна`,
    description: `Шини CEAT розміру ${decodedSize}. Високоякісні сільськогосподарські шини з офіційного складу в Україні. Швидка доставка, гарантія якості.`,
    alternates: { canonical },
    openGraph: {
      title: `Шини розміру ${decodedSize} — CEAT Україна`,
      description: `Шини CEAT розміру ${decodedSize}. Високоякісні сільськогосподарські шини з офіційного складу в Україні.`,
      url: canonical,
      type: "website",
      siteName: "CEAT Україна",
    },
    twitter: {
      card: "summary_large_image",
      title: `Шини розміру ${decodedSize} — CEAT Україна`,
      description: `Шини CEAT розміру ${decodedSize}. Високоякісні сільськогосподарські шини з офіційного складу в Україні.`,
    },
  };
}

export default async function Head({ params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  const baseUrl = await getBaseUrl();
  const decoded = decodeURIComponent(size);

  // ItemList JSON-LD for size page
  type ItemForList = { id: number; product_name: string };
  let items: ItemForList[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/products/size/${encodeURIComponent(decoded)}?limit=50`, { next: { revalidate: 300 } });
    if (res.ok) {
      const json = await res.json();
      items = ((json?.data || []) as ItemForList[]).slice(0, 50);
    }
  } catch {}

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Розмір: ${decoded}`,
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
