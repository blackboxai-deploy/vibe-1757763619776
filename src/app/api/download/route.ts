import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { url, filename } = await request.json();

    if (!url || !filename) {
      return NextResponse.json(
        { error: 'URL and filename are required' },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Fetch the media file
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000, // 30 second timeout for downloads
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': '*/*',
      },
    });

    // Get content type from response or guess from filename
    const contentType = response.headers['content-type'] || 'application/octet-stream';
    
    // Create response with file data
    return new NextResponse(response.data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': response.data.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Download error:', error);
    
    if (axios.isAxiosError(error as any)) {
      const axiosError = error as any;
      if (axiosError.code === 'ECONNABORTED') {
        return NextResponse.json(
          { error: 'Download timeout. The file took too long to download.' },
          { status: 408 }
        );
      }
      if (axiosError.response?.status === 403) {
        return NextResponse.json(
          { error: 'Access forbidden. Unable to download this file.' },
          { status: 403 }
        );
      }
      if (axiosError.response?.status === 404) {
        return NextResponse.json(
          { error: 'File not found. The media file may no longer exist.' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to download file. Please try again later.' },
      { status: 500 }
    );
  }
}