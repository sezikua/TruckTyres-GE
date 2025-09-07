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
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = await getBaseUrl();

  let product: ProductApiResponse['data'] = null;
  try {
    const res = await fetch(`${baseUrl}/api/products/${id}`, { next: { revalidate: 300 } });
    if (res.ok) {
      const json: ProductApiResponse = await res.json();
      product = json.data;
    }
  } catch {}

  const title = product
    ? `${product.product_name} — CEAT Україна`
    : 'Товар — CEAT Україна';

  const description = product?.description
    ? product.description.replace(/<[^>]*>/g, '').slice(0, 200)
    : product
      ? `Купити ${product.product_name} (${product.model}, ${product.size}) в наявності у CEAT Україна.`
      : 'Магазин товарів CEAT Україна.';

  const keywords = product
    ? [product.product_name, product.model, product.size, product.Category, product.Segment, 'CEAT', 'шини', 'агро'].filter(Boolean).join(', ')
    : 'CEAT, шини, агро, тракторні шини';

  const canonical = `${baseUrl}/products/${id}`;
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
      siteName: 'CEAT Україна',
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


