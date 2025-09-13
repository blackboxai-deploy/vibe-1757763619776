"use client";

import { useState } from "react";
import { MediaItem } from "./MediaScraper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import MediaPreview from "./MediaPreview";

interface MediaGridProps {
  mediaItems: MediaItem[];
  onToggleSelection: (index: number) => void;
  onSelectAll: () => void;
  onDownload: () => void;
  isLoading: boolean;
}

export default function MediaGrid({ 
  mediaItems, 
  onToggleSelection, 
  onSelectAll, 
  onDownload, 
  isLoading 
}: MediaGridProps) {
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-800">Scanning Website</h3>
          <p className="text-gray-600">Discovering media files...</p>
        </div>
      </div>
    );
  }

  if (mediaItems.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
          <div className="w-8 h-8 bg-gray-400 rounded-md"></div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-800">No Media Found</h3>
          <p className="text-gray-600">Try a different website or check the URL</p>
        </div>
      </div>
    );
  }

  const selectedCount = mediaItems.filter(item => item.selected).length;
  const allSelected = mediaItems.length > 0 && selectedCount === mediaItems.length;

  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return '🖼️';
      case 'video':
        return '🎬';
      case 'audio':
        return '🎵';
      default:
        return '📄';
    }
  };

  const getMediaTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'bg-green-100 text-green-800';
      case 'video':
        return 'bg-purple-100 text-purple-800';
      case 'audio':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-md rounded-lg p-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={allSelected}
              onCheckedChange={onSelectAll}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">
              Select All ({selectedCount}/{mediaItems.length})
            </span>
          </div>
          
          <div className="text-sm text-gray-600">
            Found {mediaItems.length} media files
          </div>
        </div>

        {selectedCount > 0 && (
          <Button
            onClick={onDownload}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 
              text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
              <span>Download Selected ({selectedCount})</span>
            </div>
          </Button>
        )}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mediaItems.map((item, index) => (
          <Card
            key={index}
            className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] 
              ${item.selected 
                ? 'ring-2 ring-blue-500 bg-blue-50/80' 
                : 'bg-white/80 hover:bg-white/90'
              } backdrop-blur-md`}
          >
            <CardContent className="p-4">
              {/* Selection Checkbox */}
              <div className="flex items-start justify-between mb-3">
                <Checkbox
                  checked={item.selected}
                  onCheckedChange={() => onToggleSelection(index)}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getMediaTypeColor(item.type)}`}>
                  {getMediaTypeIcon(item.type)} {item.type.toUpperCase()}
                </span>
              </div>

              {/* Media Preview */}
              <div 
                className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden cursor-pointer
                  hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
                onClick={() => setPreviewItem(item)}
              >
                {item.type === 'image' ? (
                  <img
                    src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c9d0d800-4ada-40f8-815d-b4faa727d9a0.png"
                    alt={`Preview of ${item.filename}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2Yjc5ODciIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+SW1hZ2U8L3RleHQ+PC9zdmc+';
                    }}
                  />
                ) : (
                  <div className="text-4xl opacity-50">
                    {getMediaTypeIcon(item.type)}
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="space-y-2">
                <p className="font-medium text-sm text-gray-800 truncate" title={item.filename}>
                  {item.filename}
                </p>
                <div className="flex justify-between text-xs text-gray-600">
                  {item.size && <span>{item.size}</span>}
                  {item.dimensions && <span>{item.dimensions}</span>}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-3 pt-3 border-t border-gray-200 flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPreviewItem(item)}
                  className="flex-1 text-xs hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                >
                  Preview
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    if (!item.selected) onToggleSelection(index);
                    setTimeout(() => onDownload(), 100);
                  }}
                  className="flex-1 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <MediaPreview
          item={previewItem}
          onClose={() => setPreviewItem(null)}
          onDownload={() => {
            const index = mediaItems.findIndex(item => item.url === previewItem.url);
            if (index !== -1 && !mediaItems[index].selected) {
              onToggleSelection(index);
            }
            setTimeout(() => onDownload(), 100);
          }}
        />
      )}
    </div>
  );
}