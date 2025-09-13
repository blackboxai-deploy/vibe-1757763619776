"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface Download {
  filename: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'error';
  url: string;
}

interface DownloadManagerProps {
  downloads: Download[];
}

export default function DownloadManager({ downloads }: DownloadManagerProps) {
  if (downloads.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-md">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <div className="w-8 h-8 bg-gray-300 rounded-md"></div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">No Downloads Yet</h3>
              <p className="text-gray-600">Select media files and start downloading to see progress here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-100';
      case 'downloading':
        return 'text-blue-700 bg-blue-100';
      case 'error':
        return 'text-red-700 bg-red-100';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'downloading':
        return '⬇️';
      case 'error':
        return '❌';
      case 'pending':
        return '⏳';
      default:
        return '📄';
    }
  };

  const completedCount = downloads.filter(d => d.status === 'completed').length;
  const errorCount = downloads.filter(d => d.status === 'error').length;
  const downloadingCount = downloads.filter(d => d.status === 'downloading').length;

  return (
    <div className="space-y-6">
      {/* Download Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Download Summary</span>
            <div className="flex items-center space-x-4 text-sm">
              {completedCount > 0 && (
                <span className="text-green-700 bg-green-100 px-2 py-1 rounded-full">
                  ✅ {completedCount} Completed
                </span>
              )}
              {downloadingCount > 0 && (
                <span className="text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                  ⬇️ {downloadingCount} Downloading
                </span>
              )}
              {errorCount > 0 && (
                <span className="text-red-700 bg-red-100 px-2 py-1 rounded-full">
                  ❌ {errorCount} Failed
                </span>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white/60 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-800">{downloads.length}</div>
              <div className="text-sm text-gray-600">Total Downloads</div>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((completedCount / downloads.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download List */}
      <div className="space-y-3">
        {downloads.map((download, index) => (
          <Card 
            key={index}
            className="bg-white/80 backdrop-blur-md hover:bg-white/90 transition-all duration-300"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-xl">
                    {getStatusIcon(download.status)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate" title={download.filename}>
                      {download.filename}
                    </p>
                    <p className="text-sm text-gray-500 truncate" title={download.url}>
                      {download.url}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(download.status)}`}>
                    {download.status.charAt(0).toUpperCase() + download.status.slice(1)}
                  </span>
                  
                  {download.status === 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Re-trigger download
                        const a = document.createElement('a');
                        a.href = download.url;
                        a.download = download.filename;
                        a.click();
                      }}
                      className="text-xs hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                    >
                      Download Again
                    </Button>
                  )}
                  
                  {download.status === 'error' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Retry download - this would need to be implemented in the parent component
                        console.log('Retry download:', download.filename);
                      }}
                      className="text-xs hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                    >
                      Retry
                    </Button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {(download.status === 'downloading' || download.status === 'completed') && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress</span>
                    <span>{download.progress}%</span>
                  </div>
                  <Progress 
                    value={download.progress} 
                    className="h-2"
                  />
                </div>
              )}

              {/* Error Message */}
              {download.status === 'error' && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  Failed to download file. Please try again or check the URL.
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      {downloads.length > 0 && (
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={() => {
              // Clear completed downloads - this would need to be implemented in parent
              console.log('Clear completed downloads');
            }}
            className="hover:bg-gray-50"
          >
            Clear Completed
          </Button>
          
          {errorCount > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                // Retry all failed downloads - this would need to be implemented in parent
                console.log('Retry all failed');
              }}
              className="hover:bg-red-50 hover:text-red-700 hover:border-red-300"
            >
              Retry All Failed
            </Button>
          )}
        </div>
      )}
    </div>
  );
}