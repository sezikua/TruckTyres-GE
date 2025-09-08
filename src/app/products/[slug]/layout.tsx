import type { Metadata } from 'next';
import { headers } from 'next/headers';

type ProductApiResponse = {
  data: {
    id: number;
    sku: string;
    product_name: string;
    model: string;
    size: string;
    description: string | null;
    product_image: string | null;
    Category: string;
    Segment: string;
    regular_price: string;
    discount_price: string | null;
    warehouse: string;
    slug?: string;
  } | null;
};

async function getBaseUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || 'https';
  return `${proto}://${host}`;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = await getBaseUrl();

  let product: ProductApiResponse['data'] = null;
  try {
    const res = await fetch(`${baseUrl}/api/products/slug/${encodeURIComponent(slug)}`, { next: { revalidate: 300 } });
    if (res.ok) {
      const json: ProductApiResponse = await res.json();
      product = json.data;
    }
  } catch {}

  const title = product
    ? `${product.product_name} — CEAT — офіційний імпортер в Україні`
    : 'Товар — CEAT — офіційний імпортер в Україні';

  const description = product?.description
    ? product.description.replace(/<[^>]*>/g, '').slice(0, 200)
    : product
      ? `Купити ${product.product_name} (${product.model}, ${product.size}) в наявності у CEAT — офіційний імпортер в Україні.`
      : 'Магазин шин CEAT — офіційний імпортер в Україні.';

  const keywords = product
    ? [product.product_name, product.model, product.size, product.Category, product.Segment, 'CEAT', 'шини', 'агро'].filter(Boolean).join(', ')
    : 'CEAT, шини, агро, тракторні шини';

  const canonical = `${baseUrl}/products/${encodeURIComponent(slug)}`;
  const ogImage = product?.product_image ? `${baseUrl}/api/assets/${product.product_image}` : `${baseUrl}/placeholder-image.svg`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonical,
      images: [{ url: ogImage, alt: product?.product_name || 'CEAT product' }],
      siteName: 'CEAT — офіційний імпортер в Україні',
      locale: 'uk_UA',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}


