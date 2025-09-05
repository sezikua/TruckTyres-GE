import { NextResponse } from 'next/server';

interface SegmentItem {
  Segment: string;
}

interface SegmentsResponse {
  data: SegmentItem[];
}

export async function GET() {
  try {
    // Получаем все уникальные сегменты из базы данных
    const url = 'http://173.212.215.18:8055/items/Product?fields=Segment&limit=-1';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer wFd_KOyK9LJEZSe98DEu8Uww5wKGg1qD',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SegmentsResponse = await response.json();
    
    // Извлекаем уникальные сегменты и сортируем их
    const segments = [...new Set(data.data.map((item: SegmentItem) => item.Segment).filter(Boolean))].sort();
    
    return NextResponse.json({ segments });
  } catch (error) {
    console.error('Error fetching segments:', error);
    return NextResponse.json(
      { error: 'Помилка отримання сегментів з сервера' },
      { status: 500 }
    );
  }
}
