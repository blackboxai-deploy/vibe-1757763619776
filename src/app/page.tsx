"use client";

import MediaScraper from "@/components/MediaScraper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Windows 10 Media Scraper</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 max-w-4xl mx-auto leading-tight">
          Scrape Media from Any Website
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Extract images, videos, and audio files from websites with our modern Windows 10-style scraper
        </p>
      </div>

      {/* Main Application */}
      <Card className="bg-white/80 backdrop-blur-md shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-semibold">Media Scraper Dashboard</CardTitle>
          <CardDescription className="text-blue-100">
            Enter a website URL to discover and download media content
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <MediaScraper />
        </CardContent>
      </Card>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-white/70 backdrop-blur-md hover:bg-white/80 transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-blue-600 rounded-md"></div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Detection</h3>
            <p className="text-gray-600 text-sm">
              Automatically detects images, videos, and audio files from any website
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-md hover:bg-white/80 transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-green-600 rounded-md"></div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Batch Download</h3>
            <p className="text-gray-600 text-sm">
              Select multiple media files and download them all at once with progress tracking
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-md hover:bg-white/80 transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-purple-600 rounded-md"></div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Windows 10 Style</h3>
            <p className="text-gray-600 text-sm">
              Modern Fluent Design interface with familiar Windows 10 aesthetics
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}