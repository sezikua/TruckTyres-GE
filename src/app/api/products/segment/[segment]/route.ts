import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ segment: string }> }
) {
  try {
    const { segment } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '30');
    
    const directusUrl = process.env.DIRECTUS_URL || 'http://173.212.215.18:8055';
    const directusToken = process.env.DIRECTUS_TOKEN || 'wFd_KOyK9LJEZSe98DEu8Uww5wKGg1qD';
    
    const decodedSegment = decodeURIComponent(segment);
    
    let url = `${directusUrl}/items/Product?page=${page}&limit=${limit}&meta=total_count`;
    const filters: string[] = [];
    
    // Segment filter
    filters.push(`filter[Segment][_eq]=${encodeURIComponent(decodedSegment)}`);
    
    if (filters.length > 0) {
      url += '&' + filters.join('&');
    }
    
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
    
    // Transform the response to match our expected format
    const transformedData = {
      data: data.data || [],
      pagination: {
        page: data.meta?.page || page,
        limit: data.meta?.limit || limit,
        total: data.meta?.total_count || 0,
        totalPages: Math.ceil((data.meta?.total_count || 0) / (data.meta?.limit || limit))
      }
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching products by segment:', error);
    return NextResponse.json(
      { error: 'Помилка отримання товарів за сегментом' },
      { status: 500 }
    );
  }
}
