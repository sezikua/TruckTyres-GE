import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const directusUrl = process.env.DIRECTUS_URL || 'http://173.212.215.18:8055';
    const directusToken = process.env.DIRECTUS_TOKEN || 'wFd_KOyK9LJEZSe98DEu8Uww5wKGg1qD';

    // Assuming there is a slug field on Product in Directus
    const url = `${directusUrl}/items/Product?filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${directusToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const item = Array.isArray(data?.data) ? data.data[0] : null;
    return NextResponse.json({ data: item });
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return NextResponse.json(
      { error: 'Помилка отримання товару з сервера' },
      { status: 500 }
    );
  }
}


