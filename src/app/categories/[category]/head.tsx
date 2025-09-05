import { headers } from 'next/headers';

async function getBaseUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || 'https';
  return `${proto}://${host}`;
}

export default async function Head({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const baseUrl = await getBaseUrl();
  const decoded = decodeURIComponent(category);

  // ItemList JSON-LD for category page
  let items: Array<{ id: number; product_name: string } & Record<string, unknown>> = [];
  try {
    const res = await fetch(`${baseUrl}/api/products?category=${encodeURIComponent(decoded)}&limit=50`, { next: { revalidate: 300 } });
    if (res.ok) {
      const json = await res.json();
      items = (json?.data || []).slice(0, 50);
    }
  } catch {}

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Категорія: ${decoded}`,
    itemListElement: items.map((p: any, index: number) => ({
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


