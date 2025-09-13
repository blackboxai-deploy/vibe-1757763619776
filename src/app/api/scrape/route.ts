import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import mime from 'mime-types';

interface MediaItem {
  url: string;
  type: 'image' | 'video' | 'audio';
  size?: string;
  dimensions?: string;
  filename: string;
  selected: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Fetch the webpage
    const response = await axios.get(targetUrl.toString(), {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const mediaItems: MediaItem[] = [];
    const processedUrls = new Set<string>();

    // Helper function to resolve relative URLs
    const resolveUrl = (src: string): string => {
      try {
        return new URL(src, targetUrl.toString()).toString();
      } catch {
        return src;
      }
    };

    // Helper function to get file extension and type
    const getMediaType = (url: string): 'image' | 'video' | 'audio' | null => {
      const mimeType = mime.lookup(url);
      if (!mimeType) return null;

      if (mimeType.startsWith('image/')) return 'image';
      if (mimeType.startsWith('video/')) return 'video';
      if (mimeType.startsWith('audio/')) return 'audio';
      
      return null;
    };

    // Helper function to extract filename from URL
    const getFilename = (url: string): string => {
      try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const filename = pathname.split('/').pop() || 'download';
        
        // If no extension, try to add one based on content type
        if (!filename.includes('.')) {
          const type = getMediaType(url);
          switch (type) {
            case 'image':
              return filename + '.jpg';
            case 'video':
              return filename + '.mp4';
            case 'audio':
              return filename + '.mp3';
            default:
              return filename;
          }
        }
        
        return filename;
      } catch {
        return 'download';
      }
    };

    // Scrape images
    $('img').each((_, element) => {
      const src = $(element).attr('src');
      if (!src) return;

      const fullUrl = resolveUrl(src);
      if (processedUrls.has(fullUrl)) return;

      const type = getMediaType(fullUrl);
      if (type === 'image') {
        processedUrls.add(fullUrl);
        
        const width = $(element).attr('width');
        const height = $(element).attr('height');
        // const alt = $(element).attr('alt') || '';
        
        mediaItems.push({
          url: fullUrl,
          type: 'image',
          filename: getFilename(fullUrl),
          dimensions: width && height ? `${width}×${height}` : undefined,
          selected: false,
        });
      }
    });

    // Scrape videos
    $('video, video source').each((_, element) => {
      const src = $(element).attr('src');
      if (!src) return;

      const fullUrl = resolveUrl(src);
      if (processedUrls.has(fullUrl)) return;

      const type = getMediaType(fullUrl);
      if (type === 'video') {
        processedUrls.add(fullUrl);
        
        mediaItems.push({
          url: fullUrl,
          type: 'video',
          filename: getFilename(fullUrl),
          selected: false,
        });
      }
    });

    // Scrape audio
    $('audio, audio source').each((_, element) => {
      const src = $(element).attr('src');
      if (!src) return;

      const fullUrl = resolveUrl(src);
      if (processedUrls.has(fullUrl)) return;

      const type = getMediaType(fullUrl);
      if (type === 'audio') {
        processedUrls.add(fullUrl);
        
        mediaItems.push({
          url: fullUrl,
          type: 'audio',
          filename: getFilename(fullUrl),
          selected: false,
        });
      }
    });

    // Scrape links to media files
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (!href) return;

      const fullUrl = resolveUrl(href);
      if (processedUrls.has(fullUrl)) return;

      const type = getMediaType(fullUrl);
      if (type) {
        processedUrls.add(fullUrl);
        
        mediaItems.push({
          url: fullUrl,
          type,
          filename: getFilename(fullUrl),
          selected: false,
        });
      }
    });

    // Scrape CSS background images
    $('*').each((_, element) => {
      const style = $(element).attr('style');
      if (!style) return;

      const bgImageMatch = style.match(/background-image:\s*url\(['"]?([^'")])['"]?\)/);
      if (bgImageMatch) {
        const src = bgImageMatch[1];
        const fullUrl = resolveUrl(src);
        
        if (!processedUrls.has(fullUrl)) {
          const type = getMediaType(fullUrl);
          if (type === 'image') {
            processedUrls.add(fullUrl);
            
            mediaItems.push({
              url: fullUrl,
              type: 'image',
              filename: getFilename(fullUrl),
              selected: false,
            });
          }
        }
      }
    });

    // Sort by type and filename
    mediaItems.sort((a, b) => {
      if (a.type !== b.type) {
        const typeOrder = { image: 0, video: 1, audio: 2 };
        return typeOrder[a.type] - typeOrder[b.type];
      }
      return a.filename.localeCompare(b.filename);
    });

    return NextResponse.json({
      success: true,
      media: mediaItems,
      count: mediaItems.length,
      scrapedUrl: targetUrl.toString(),
    });

  } catch (error) {
    console.error('Scraping error:', error);
    
    if (axios.isAxiosError(error as any)) {
      const axiosError = error as any;
      if (axiosError.code === 'ECONNABORTED') {
        return NextResponse.json(
          { error: 'Request timeout. The website took too long to respond.' },
          { status: 408 }
        );
      }
      if (axiosError.response?.status === 403) {
        return NextResponse.json(
          { error: 'Access forbidden. The website blocked our request.' },
          { status: 403 }
        );
      }
      if (axiosError.response?.status === 404) {
        return NextResponse.json(
          { error: 'Website not found. Please check the URL.' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to scrape website. Please try again later.' },
      { status: 500 }
    );
  }
}