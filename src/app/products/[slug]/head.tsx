import { headers } from 'next/headers';

async function getBaseUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || 'https';
  return `${proto}://${host}`;
}

export default async function Head({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const baseUrl = await getBaseUrl();

  type ProductForHead = {
    id: number;
    product_name: string;
    description: string | null;
    model: string;
    size: string;
    product_image: string | null;
    sku: string;
    warehouse: string;
    regular_price: string;
    discount_price: string | null;
  };
  let product: ProductForHead | null = null;
  try {
    const res = await fetch(`${baseUrl}/api/products/slug/${encodeURIComponent(slug)}`, { next: { revalidate: 300 } });
    if (res.ok) {
      const json: { data: ProductForHead | null } = await res.json();
      product = json.data ?? null;
    }
  } catch {}

  const jsonLd = product ? {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.product_name,
    description: product.description || `${product.product_name} (${product.model}, ${product.size})`,
    image: product.product_image ? `${baseUrl}/api/assets/${product.product_image}` : `${baseUrl}/placeholder-image.svg`,
    sku: product.sku,
    brand: { '@type': 'Brand', name: 'CEAT' },
    offers: {
      '@type': 'Offer',
      availability: product.warehouse?.toLowerCase() === 'in stock' ? 'https://schema.org/InStock' : (product.warehouse?.toLowerCase() === 'on order' ? 'https://schema.org/PreOrder' : 'https://schema.org/OutOfStock'),
      priceCurrency: 'UAH',
      price: product.discount_price || product.regular_price,
      url: `${baseUrl}/products/${encodeURIComponent(slug)}`,
    },
  } : null;

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
    </>
  );
}


