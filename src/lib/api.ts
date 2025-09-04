export interface Product {
  id: number;
  sku: string;
  product_name: string;
  model: string;
  size: string;
  regular_price: string;
  discount_price: string | null;
  diameter: string;
  // Directus returns UUID of the file or null
  product_image: string | null;
  description: string | null;
  specifications: string | null;
  Category: string;
  Segment: string;
  warehouse: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ProductsResponse {
  data: Product[];
  pagination: PaginationInfo;
}

export async function fetchProducts(page: number = 1, limit: number = 30): Promise<ProductsResponse> {
  try {
    const response = await fetch(`/api/products?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid data format received from API');
    }

    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Помилка отримання товарів з сервера');
  }
}

export async function fetchProductById(id: number): Promise<Product | null> {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Помилка отримання товару з сервера');
  }
}

export async function fetchProductsByCategory(category: string, page: number = 1, limit: number = 30): Promise<ProductsResponse> {
  try {
    const response = await fetch(`/api/products?category=${encodeURIComponent(category)}&page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid data format received from API');
    }

    return data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw new Error('Помилка отримання товарів за категорією');
  }
}

// Формування прямого URL до Directus Assets
export function getProductImageUrl(imageId: string | null): string {
  if (!imageId) return '/placeholder-image.svg';
  return `http://173.212.215.18:8055/assets/${imageId}`;
}
