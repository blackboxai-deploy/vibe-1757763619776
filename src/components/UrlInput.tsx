"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UrlInputProps {
  onScrape: (url: string) => void;
  isLoading: boolean;
}

export default function UrlInput({ onScrape, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const validateUrl = (input: string): boolean => {
    try {
      new URL(input);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    if (!validateUrl(url)) {
      setError("Please enter a valid URL (including http:// or https://)");
      return;
    }

    setError("");
    onScrape(url);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url" className="text-sm font-medium text-gray-700">
          Website URL
        </Label>
        <div className="flex space-x-3">
          <div className="flex-1">
            <Input
              id="url"
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={handleInputChange}
              className={`h-12 text-lg ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'} 
                bg-white/90 backdrop-blur-sm`}
              disabled={isLoading}
            />
            {error && (
              <p className="text-red-600 text-sm mt-1 flex items-center space-x-1">
                <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</span>
                <span>{error}</span>
              </p>
            )}
          </div>
          
          <Button
            type="submit"
            disabled={isLoading || !url.trim()}
            className={`h-12 px-8 text-lg font-medium transition-all duration-300 
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
              }`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Scraping...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-white/20 rounded-md flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-sm"></div>
                </div>
                <span>Scrape Media</span>
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Quick Examples */}
      <div className="bg-white/60 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Examples:</h4>
        <div className="flex flex-wrap gap-2">
          {[
            "https://unsplash.com",
            "https://example.com",
            "https://wikipedia.org"
          ].map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setUrl(example)}
              className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1.5 rounded-full 
                transition-colors duration-200"
              disabled={isLoading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}