import { NextRequest, NextResponse } from 'next/server';
import { SlideshowImage } from '@/types';

// In-memory server-side store for slideshow images
let serverSlideshowDb: SlideshowImage[] = [];

export async function GET() {
  return NextResponse.json({ success: true, data: serverSlideshowDb });
}

export async function POST(req: NextRequest) {
  try {
    const body: SlideshowImage = await req.json();
    if (!body || !body.url) {
      return NextResponse.json({ success: false, error: 'Invalid slideshow image payload' }, { status: 400 });
    }

    const existingIdx = serverSlideshowDb.findIndex(s => s.id === body.id);
    if (existingIdx >= 0) {
      serverSlideshowDb[existingIdx] = body;
    } else {
      serverSlideshowDb = [body, ...serverSlideshowDb];
    }

    return NextResponse.json({ success: true, data: serverSlideshowDb });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to save slide' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (id) {
      serverSlideshowDb = serverSlideshowDb.filter(s => s.id !== id);
    }
    return NextResponse.json({ success: true, data: serverSlideshowDb });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to delete slide' }, { status: 500 });
  }
}
