import { NextResponse } from 'next/server';

interface DirectusProduct {
  id: number;
  warehouse: string;
  product_name: string;
  [key: string]: unknown;
}

interface DirectusResponse {
  data: DirectusProduct[];
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ size: string }> }
) {
  try {
    const { size: sizeParam } = await params;
    const size = decodeURIComponent(sizeParam);
    
    // Fetch products with the same size, sorted by warehouse status
    // Priority: in stock > on order > out of stock
    const response = await fetch(`http://173.212.215.18:8055/items/Product?filter[size][_eq]=${encodeURIComponent(size)}&sort[]=warehouse&limit=12`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer wFd_KOyK9LJEZSe98DEu8Uww5wKGg1qD',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DirectusResponse = await response.json();
    
    // Custom sort to ensure proper order: in stock > on order > out of stock
    const sortedProducts = data.data.sort((a: DirectusProduct, b: DirectusProduct) => {
      const warehouseOrder: Record<string, number> = { 'in stock': 0, 'on order': 1, 'out of stock': 2 };
      const aOrder = warehouseOrder[a.warehouse?.toLowerCase()] ?? 3;
      const bOrder = warehouseOrder[b.warehouse?.toLowerCase()] ?? 3;
      
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      
      // If warehouse status is the same, sort by product name
      return a.product_name.localeCompare(b.product_name);
    });

    return NextResponse.json({ 
      data: sortedProducts,
      total: data.data.length 
    });
  } catch (error) {
    console.error('Error fetching similar products:', error);
    return NextResponse.json(
      { error: 'Помилка отримання схожих товарів з сервера' },
      { status: 500 }
    );
  }
}
