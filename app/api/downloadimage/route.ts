import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const imageUrl = new URL(request.url).searchParams.get('url');
    if (!imageUrl) throw new Error('No URL provided');

    const response = await fetch(imageUrl);
    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const mimeType = response.headers.get('content-type');
    
    return NextResponse.json({
      imageData: `data:${mimeType};base64,${base64Image}`
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}