"use client";

import { useState } from "react";
import UrlInput from "./UrlInput";
import MediaGrid from "./MediaGrid";
import DownloadManager from "./DownloadManager";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface MediaItem {
  url: string;
  type: 'image' | 'video' | 'audio';
  size?: string;
  dimensions?: string;
  filename: string;
  selected: boolean;
}

export default function MediaScraper() {
  const [isLoading, setIsLoading] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [downloads, setDownloads] = useState<Array<{
    filename: string;
    progress: number;
    status: 'pending' | 'downloading' | 'completed' | 'error';
    url: string;
  }>>([]);
  const [scrapedUrl, setScrapedUrl] = useState<string>("");

  const handleScrape = async (url: string) => {
    setIsLoading(true);
    setScrapedUrl(url);
    
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to scrape website');
      }

      const data = await response.json();
      setMediaItems(data.media || []);
    } catch (error) {
      console.error('Scraping error:', error);
      // Show error notification
      alert('Failed to scrape website. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSelection = (index: number) => {
    setMediaItems(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleSelectAll = () => {
    const allSelected = mediaItems.every(item => item.selected);
    setMediaItems(prev =>
      prev.map(item => ({ ...item, selected: !allSelected }))
    );
  };

  const handleDownload = async () => {
    const selectedItems = mediaItems.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      alert('Please select at least one media item to download');
      return;
    }

    // Initialize download states
    const newDownloads = selectedItems.map(item => ({
      filename: item.filename,
      progress: 0,
      status: 'pending' as const,
      url: item.url,
    }));

    setDownloads(newDownloads);

    // Start downloads
    for (let i = 0; i < selectedItems.length; i++) {
      try {
        setDownloads(prev => 
          prev.map((download, idx) => 
            idx === i ? { ...download, status: 'downloading' } : download
          )
        );

        const response = await fetch('/api/download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: selectedItems[i].url, filename: selectedItems[i].filename }),
        });

        if (response.ok) {
          const blob = await response.blob();
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = selectedItems[i].filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);

          setDownloads(prev => 
            prev.map((download, idx) => 
              idx === i ? { ...download, status: 'completed', progress: 100 } : download
            )
          );
        } else {
          throw new Error('Download failed');
        }
      } catch (error) {
        console.error('Download error:', error);
        setDownloads(prev => 
          prev.map((download, idx) => 
            idx === i ? { ...download, status: 'error' } : download
          )
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* URL Input Section */}
      <Card className="bg-blue-50/50 border-blue-200">
        <CardContent className="p-6">
          <UrlInput onScrape={handleScrape} isLoading={isLoading} />
        </CardContent>
      </Card>

      {/* Results Section */}
      {(mediaItems.length > 0 || downloads.length > 0) && (
        <Tabs defaultValue="media" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/80">
            <TabsTrigger value="media" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Found Media ({mediaItems.length})
            </TabsTrigger>
            <TabsTrigger value="downloads" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Downloads ({downloads.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="media" className="space-y-4">
            {scrapedUrl && (
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Scraped from:</p>
                <p className="font-medium text-gray-800 truncate">{scrapedUrl}</p>
              </div>
            )}
            
            <MediaGrid
              mediaItems={mediaItems}
              onToggleSelection={handleToggleSelection}
              onSelectAll={handleSelectAll}
              onDownload={handleDownload}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="downloads">
            <DownloadManager downloads={downloads} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}