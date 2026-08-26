import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables or provided credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dwzv8izif',
  api_key: process.env.CLOUDINARY_API_KEY || '628886157629233',
  api_secret: process.env.CLOUDINARY_API_SECRET || '4dq9OFSKXmr4Qkp0JfCVPYBPkf0',
  secure: true,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'sih-hackathon';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided in request body.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = file.name;
    const lowerName = fileName.toLowerCase();
    const isPpt = lowerName.endsWith('.ppt') || lowerName.endsWith('.pptx');
    const isImage = file.type.startsWith('image/');

    // Determine resource_type: 'raw' for documents like PPT/PPTX so Cloudinary serves them as binary downloads,
    // 'image' for images so Cloudinary optimizes them.
    const resourceType: 'image' | 'raw' | 'auto' = isPpt ? 'raw' : isImage ? 'image' : 'auto';

    // Clean public ID from original file name
    const sanitizedBaseName = fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = Date.now();
    const publicId = `${sanitizedBaseName}_${timestamp}`;

    const uploadOptions: Record<string, any> = {
      folder: `sih-crre/${folder}`,
      public_id: publicId,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
    };

    // If PPT file, append extension to raw file so Cloudinary download preserves .pptx extension
    if (isPpt) {
      const ext = lowerName.endsWith('.pptx') ? '.pptx' : '.ppt';
      uploadOptions.public_id = `${publicId}${ext}`;
    }

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary Stream Upload Error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format || (isPpt ? (lowerName.endsWith('.pptx') ? 'pptx' : 'ppt') : ''),
      original_filename: fileName,
      resource_type: result.resource_type,
      bytes: result.bytes || buffer.length,
    });
  } catch (error: any) {
    console.error('Cloudinary API Route Handler Exception:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to upload file to Cloudinary.',
      },
      { status: 500 }
    );
  }
}
