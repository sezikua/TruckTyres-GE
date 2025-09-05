import { NextResponse } from 'next/server';

interface CategoryItem {
  Category: string;
}

interface CategoriesResponse {
  data: CategoryItem[];
}

export async function GET() {
  try {
    // Получаем все уникальные категории из базы данных
    const directusUrl = process.env.DIRECTUS_URL || 'http://173.212.215.18:8055';
    const directusToken = process.env.DIRECTUS_TOKEN || 'wFd_KOyK9LJEZSe98DEu8Uww5wKGg1qD';
    const url = `${directusUrl}/items/Product?fields=Category&limit=-1`;
    
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

    const data: CategoriesResponse = await response.json();
    
    // Извлекаем уникальные категории и сортируем их
    const categories = [...new Set(data.data.map((item: CategoryItem) => item.Category).filter(Boolean))].sort();
    
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Помилка отримання категорій з сервера' },
      { status: 500 }
    );
  }
}
