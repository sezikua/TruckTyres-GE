import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ size: string }> }
) {
  try {
    const { size } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '30');

    const directusUrl = process.env.DIRECTUS_URL || 'http://173.212.215.18:8055';
    const directusToken = process.env.DIRECTUS_TOKEN || 'wFd_KOyK9LJEZSe98DEu8Uww5wKGg1qD';

    const encodedSize = encodeURIComponent(size);
    const url = `${directusUrl}/items/Product?filter[size][_eq]=${encodedSize}&page=${page}&limit=${limit}&meta=total_count`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${directusToken}`,
      },
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({
      data: data.data,
      pagination: {
        total: data.meta.total_count,
        page,
        limit,
        totalPages: Math.ceil(data.meta.total_count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products by size:', error);
    return NextResponse.json(
      { error: 'Помилка отримання товарів за розміром' },
      { status: 500 }
    );
  }
}
