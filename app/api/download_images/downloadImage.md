import * as fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

async function downloadImage(imageUrl: string): Promise<string> {
  const folder = path.join(process.cwd(), 'public', 'images');
  
  // Create folder if it doesn't exist
  try {
    await fs.access(folder);
  } catch {
    await fs.mkdir(folder, { recursive: true });
  }

  // Download and save image
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const filename = imageUrl.split('/').pop() || `image-${Date.now()}.png`;
    const filepath = path.join(folder, filename);
    
    await fs.writeFile(filepath, Buffer.from(buffer));
    return `/images/${filename}`; // Return public path
  } catch (error) {
    console.error('Failed to download image:', error);
    return NextResponse
  }
}

export { downloadImage };