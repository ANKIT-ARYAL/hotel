import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const originalExtension = file.name.split('.').pop() || 'png';
    const filename = `${uniqueSuffix}.${originalExtension}`;
    
    const uploadDir = join(process.cwd(), 'public/uploads');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const path = join(uploadDir, filename);
    await writeFile(path, buffer);
    
    const fileUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
