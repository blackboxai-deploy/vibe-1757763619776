import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Windows 10 Media Scraper",
  description: "A modern media scraper application with Windows 10 styling",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100`}>
        <div className="min-h-screen flex flex-col">
          {/* Windows 10 Style Header */}
          <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 bg-white rounded-sm opacity-90"></div>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Media Scraper</h1>
                  <p className="text-sm text-gray-600">Windows 10 Style</p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 container mx-auto px-6 py-8">
            {children}
          </main>

          {/* Windows 10 Style Footer */}
          <footer className="bg-white/60 backdrop-blur-md border-t border-gray-200">
            <div className="container mx-auto px-6 py-4">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <p>© 2024 Media Scraper - Windows 10 Style Application</p>
                <div className="flex items-center space-x-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    v1.0.0
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}