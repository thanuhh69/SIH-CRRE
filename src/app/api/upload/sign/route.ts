import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dwzv8izif',
  api_key: process.env.CLOUDINARY_API_KEY || '628886157629233',
  api_secret: process.env.CLOUDINARY_API_SECRET || '4dq9OFSKXmr4Qkp0JfCVPYBPkf0',
  secure: true,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const folder = body.folder || 'registration-files';
    const fileName = body.fileName || 'presentation.pptx';

    const timestamp = Math.floor(Date.now() / 1000);
    const sanitizedBaseName = fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_');

    const lowerName = fileName.toLowerCase();
    const isPpt = lowerName.endsWith('.ppt') || lowerName.endsWith('.pptx');
    const isImage = body.fileType ? body.fileType.startsWith('image/') : false;
    const resourceType = isPpt ? 'raw' : isImage ? 'image' : 'auto';

    let publicId = `${sanitizedBaseName}_${Date.now()}`;
    if (isPpt) {
      const ext = lowerName.endsWith('.pptx') ? '.pptx' : '.ppt';
      publicId = `${publicId}${ext}`;
    }

    const folderPath = `sih-crre/${folder}`;
    const paramsToSign = {
      folder: folderPath,
      public_id: publicId,
      timestamp,
    };

    const apiSecret = process.env.CLOUDINARY_API_SECRET || '4dq9OFSKXmr4Qkp0JfCVPYBPkf0';
    const apiKey = process.env.CLOUDINARY_API_KEY || '628886157629233';
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dwzv8izif';

    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

    return NextResponse.json({
      success: true,
      signature,
      timestamp,
      public_id: publicId,
      folder: folderPath,
      resource_type: resourceType,
      api_key: apiKey,
      cloud_name: cloudName,
    });
  } catch (err: any) {
    console.error('Error signing Cloudinary upload request:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Signature creation failed' },
      { status: 500 }
    );
  }
}
