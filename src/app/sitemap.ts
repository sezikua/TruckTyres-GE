import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';

async function getBaseUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || 'https';
  return `${proto}://${host}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getBaseUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contacts`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  // Fetch categories and a subset of products for sitemap
  const [productsRes, categoriesRes] = await Promise.allSettled([
    fetch(`${baseUrl}/api/products?limit=1000`, { next: { revalidate: 600 } }),
    fetch(`${baseUrl}/api/categories`, { next: { revalidate: 600 } }),
  ]);

  const urls: MetadataRoute.Sitemap = [...staticRoutes];

  if (categoriesRes.status === 'fulfilled' && categoriesRes.value.ok) {
    try {
      const categoriesJson = await categoriesRes.value.json();
      const categories: string[] = categoriesJson?.data || [];
      categories.forEach((c: string) => {
        urls.push({
          url: `${baseUrl}/categories/${encodeURIComponent(c)}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });
    } catch {}
  }

  if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
    try {
      const productsJson = await productsRes.value.json();
      const products: Array<{ id: number }> = productsJson?.data || [];
      products.forEach((p) => {
        urls.push({
          url: `${baseUrl}/products/${p.id}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.9,
        });
      });
    } catch {}
  }

  return urls;
}


