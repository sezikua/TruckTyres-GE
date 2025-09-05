import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';

function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');
  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || 'https';
  return `${proto}://${host}`;
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/products', '/products/*', '/categories/*'],
      disallow: ['/api/*'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}


