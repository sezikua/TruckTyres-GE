import type { Metadata } from "next";
import { headers } from 'next/headers';

async function getBaseUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || 'https';
  return `${proto}://${host}`;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const baseUrl = await getBaseUrl();
  const decodedCategory = decodeURIComponent(category);
  const canonical = `${baseUrl}/categories/${category}`;
  
  return {
    title: `${decodedCategory} — CEAT Україна`,
    description: `Шини CEAT категорії ${decodedCategory}. Високоякісні сільськогосподарські шини з офіційного складу в Україні. Швидка доставка, гарантія якості.`,
    alternates: { canonical },
    openGraph: {
      title: `${decodedCategory} — CEAT Україна`,
      description: `Шини CEAT категорії ${decodedCategory}. Високоякісні сільськогосподарські шини з офіційного складу в Україні.`,
      url: canonical,
      type: "website",
      siteName: "CEAT Україна",
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedCategory} — CEAT Україна`,
      description: `Шини CEAT категорії ${decodedCategory}. Високоякісні сільськогосподарські шини з офіційного складу в Україні.`,
    },
  };
}

export default async function Head({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const baseUrl = await getBaseUrl();
  const decoded = decodeURIComponent(category);

  // ItemList JSON-LD for category page
  type ItemForList = { id: number; product_name: string };
  let items: ItemForList[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/products?category=${encodeURIComponent(decoded)}&limit=50`, { next: { revalidate: 300 } });
    if (res.ok) {
      const json = await res.json();
      items = ((json?.data || []) as ItemForList[]).slice(0, 50);
    }
  } catch {}

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Категорія: ${decoded}`,
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


