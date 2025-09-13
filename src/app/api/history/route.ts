import { NextRequest, NextResponse } from 'next/server';

interface HistoryItem {
  id: string;
  url: string;
  timestamp: number;
  mediaCount: number;
  title?: string;
}

// In a real application, this would be stored in a database
// For now, we'll use in-memory storage (this will reset on server restart)
let history: HistoryItem[] = [];

export async function GET() {
  try {
    // Return history sorted by most recent first
    const sortedHistory = history.sort((a, b) => b.timestamp - a.timestamp);
    
    return NextResponse.json({
      success: true,
      history: sortedHistory,
      count: sortedHistory.length,
    });
  } catch (error) {
    console.error('History fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url, mediaCount, title } = await request.json();

    if (!url || mediaCount === undefined) {
      return NextResponse.json(
        { error: 'URL and mediaCount are required' },
        { status: 400 }
      );
    }

    // Create new history item
    const historyItem: HistoryItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      url,
      timestamp: Date.now(),
      mediaCount,
      title,
    };

    // Check if URL already exists in history
    const existingIndex = history.findIndex(item => item.url === url);
    if (existingIndex !== -1) {
      // Update existing entry
      history[existingIndex] = { ...historyItem, id: history[existingIndex].id };
    } else {
      // Add new entry
      history.unshift(historyItem);
      
      // Limit history to last 100 entries
      if (history.length > 100) {
        history = history.slice(0, 100);
      }
    }

    return NextResponse.json({
      success: true,
      history: historyItem,
    });
  } catch (error) {
    console.error('History save error:', error);
    return NextResponse.json(
      { error: 'Failed to save to history' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    // Remove item from history
    history = history.filter(item => item.id !== id);

    return NextResponse.json({
      success: true,
      message: 'History item deleted',
    });
  } catch (error) {
    console.error('History delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete history item' },
      { status: 500 }
    );
  }
}