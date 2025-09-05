import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = `http://173.212.215.18:8055/assets/${id}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer wFd_KOyK9LJEZSe98DEu8Uww5wKGg1qD',
      },
    });

    if (!response.ok) {
      return new NextResponse('Not found', { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching asset:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}





