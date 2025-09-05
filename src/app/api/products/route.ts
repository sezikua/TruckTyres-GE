import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const categories = searchParams.get('categories'); // Multiple categories
    const segments = searchParams.get('segments'); // Multiple segments
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
    
    // Single category filter (for backward compatibility)
    if (category) {
      filters.push(`filter[Category][_eq]=${encodeURIComponent(category)}`);
    }
    
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
    
    // Search filter
    if (search) {
      // Пошук по назві товару, моделі, розміру та SKU
      const searchTerms = encodeURIComponent(search);
      filters.push(`filter[_or][0][product_name][_contains]=${searchTerms}`);
      filters.push(`filter[_or][1][model][_contains]=${searchTerms}`);
      filters.push(`filter[_or][2][size][_contains]=${searchTerms}`);
      filters.push(`filter[_or][3][sku][_contains]=${searchTerms}`);
    }
    
    // Combine all filters
    if (filters.length > 0) {
      url = `http://173.212.215.18:8055/items/Product?${filters.join('&')}&page=${page}&limit=${limit}&meta=total_count`;
    }

    // Отримуємо загальну кількість товарів для пагінації
    let totalUrl = 'http://173.212.215.18:8055/items/Product?limit=0&meta=total_count';
    if (filters.length > 0) {
      totalUrl = `http://173.212.215.18:8055/items/Product?${filters.join('&')}&limit=0&meta=total_count`;
    }

    const [response, totalResponse] = await Promise.all([
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${directusToken}`,
        },
      }),
      fetch(totalUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${directusToken}`,
        },
      })
    ]);

    if (!response.ok || !totalResponse.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const [data, totalData] = await Promise.all([
      response.json(),
      totalResponse.json()
    ]);

    const totalItems = totalData?.meta?.total_count ?? data?.meta?.total_count ?? 0;
    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      ...data,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Помилка отримання товарів з сервера' },
      { status: 500 }
    );
  }
}
