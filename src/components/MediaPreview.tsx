"use client";

import { MediaItem } from "./MediaScraper";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface MediaPreviewProps {
  item: MediaItem;
  onClose: () => void;
  onDownload: () => void;
}

export default function MediaPreview({ item, onClose, onDownload }: MediaPreviewProps) {
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

  const renderPreview = () => {
    switch (item.type) {
      case 'image':
        return (
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img
              src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9a7794be-27cd-4434-86d3-507fb6bdd123.png"
              alt={`Preview of ${item.filename}`}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2Yjc5ODciIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+SW1hZ2UgUHJldmlldyBOb3QgQXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
              }}
            />
          </div>
        );
      
      case 'video':
        return (
          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="text-center text-white space-y-4">
              <div className="text-6xl">🎬</div>
              <div>
                <p className="text-lg font-medium">Video Preview</p>
                <p className="text-gray-300">Click download to save video file</p>
              </div>
            </div>
          </div>
        );
      
      case 'audio':
        return (
          <div className="aspect-video bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <div className="text-center text-white space-y-4">
              <div className="text-6xl">🎵</div>
              <div>
                <p className="text-lg font-medium">Audio Preview</p>
                <p className="text-purple-200">Click download to save audio file</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-600 space-y-4">
              <div className="text-6xl">📄</div>
              <div>
                <p className="text-lg font-medium">File Preview</p>
                <p className="text-gray-500">Preview not available</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md">
        <DialogHeader className="space-y-4">
          <DialogTitle className="flex items-center space-x-3 text-xl">
            <span className="text-2xl">{getMediaTypeIcon(item.type)}</span>
            <div>
              <span className="font-semibold">{item.filename}</span>
              <div className="text-sm font-normal text-gray-600 capitalize">
                {item.type} File Preview
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview Area */}
          {renderPreview()}

          {/* File Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-3">File Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Filename:</span>
                <p className="font-medium text-gray-800 break-all">{item.filename}</p>
              </div>
              <div>
                <span className="text-gray-600">Type:</span>
                <p className="font-medium text-gray-800 capitalize">{item.type}</p>
              </div>
              {item.size && (
                <div>
                  <span className="text-gray-600">Size:</span>
                  <p className="font-medium text-gray-800">{item.size}</p>
                </div>
              )}
              {item.dimensions && (
                <div>
                  <span className="text-gray-600">Dimensions:</span>
                  <p className="font-medium text-gray-800">{item.dimensions}</p>
                </div>
              )}
              <div>
                <span className="text-gray-600">URL:</span>
                <p className="font-medium text-gray-800 break-all text-xs">{item.url}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 hover:bg-gray-50"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                onDownload();
                onClose();
              }}
              className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 
                hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
                <span>Download File</span>
              </div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}