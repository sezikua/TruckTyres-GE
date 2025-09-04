import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '30');
    
    let url = `http://173.212.215.18:8055/items/Product?page=${page}&limit=${limit}&meta=total_count`;
    
    if (category) {
      url = `http://173.212.215.18:8055/items/Product?filter[Category][_eq]=${encodeURIComponent(category)}&page=${page}&limit=${limit}&meta=total_count`;
    }
    
    if (search) {
      // Пошук по назві товару, моделі, розміру та SKU
      const searchFilter = `filter[product_name][_contains]=${encodeURIComponent(search)}&filter[model][_contains]=${encodeURIComponent(search)}&filter[size][_contains]=${encodeURIComponent(search)}&filter[sku][_contains]=${encodeURIComponent(search)}`;
      url = `http://173.212.215.18:8055/items/Product?${searchFilter}&page=${page}&limit=${limit}&meta=total_count`;
    }

    // Отримуємо загальну кількість товарів для пагінації
    let totalUrl = 'http://173.212.215.18:8055/items/Product?limit=0&meta=total_count';
    if (category) {
      totalUrl = `http://173.212.215.18:8055/items/Product?filter[Category][_eq]=${encodeURIComponent(category)}&limit=0&meta=total_count`;
    }
    if (search) {
      const searchFilter = `filter[product_name][_contains]=${encodeURIComponent(search)}&filter[model][_contains]=${encodeURIComponent(search)}&filter[size][_contains]=${encodeURIComponent(search)}&filter[sku][_contains]=${encodeURIComponent(search)}`;
      totalUrl = `http://173.212.215.18:8055/items/Product?${searchFilter}&limit=0&meta=total_count`;
    }

    const [response, totalResponse] = await Promise.all([
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer wFd_KOyK9LJEZSe98DEu8Uww5wKGg1qD',
        },
      }),
      fetch(totalUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer wFd_KOyK9LJEZSe98DEu8Uww5wKGg1qD',
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
