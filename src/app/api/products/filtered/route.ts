import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categories = searchParams.get('categories');
    const segments = searchParams.get('segments');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const warehouse = searchParams.get('warehouse');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '30');
    
    const directusUrl = process.env.DIRECTUS_URL || 'http://173.212.215.18:8055';
    const directusToken = process.env.DIRECTUS_TOKEN || 'wFd_KOyK9LJEZSe98DEu8Uww5wKGg1qD';
    
    let url = `${directusUrl}/items/Product?page=${page}&limit=${limit}&meta=total_count`;
    const filters: string[] = [];
    
    // Multiple categories filter
    if (categories) {
      const categoryList = categories.split(',').map(c => encodeURIComponent(c.trim()));
      if (categoryList.length > 0) {
        filters.push(`filter[Category][_in]=${categoryList.join(',')}`);
      }
    }
    
    // Multiple segments filter
    if (segments) {
      const segmentList = segments.split(',').map(s => encodeURIComponent(s.trim()));
      if (segmentList.length > 0) {
        filters.push(`filter[Segment][_in]=${segmentList.join(',')}`);
      }
    }
    
    // Search filter
    if (search) {
      filters.push(`filter[product_name][_icontains]=${encodeURIComponent(search)}`);
    }
    
    // Price range filters
    if (minPrice) {
      filters.push(`filter[regular_price][_gte]=${minPrice}`);
    }
    if (maxPrice) {
      filters.push(`filter[regular_price][_lte]=${maxPrice}`);
    }
    
    // Warehouse filter
    if (warehouse && warehouse !== 'all') {
      filters.push(`filter[warehouse][_eq]=${encodeURIComponent(warehouse)}`);
    }
    
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
    console.error('Error fetching filtered products:', error);
    return NextResponse.json(
      { error: 'Помилка отримання відфільтрованих товарів' },
      { status: 500 }
    );
  }
}
