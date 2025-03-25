import './globals.css';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JobeasyO - AI Career Assistant',
  description: 'Your AI-powered career assistant to help you find your perfect role that matches your skills and experience',
  keywords: 'career assistant, job search, AI, job matching, job finder, career advice',
  authors: [{ name: 'JobeasyO Team' }],
  openGraph: {
    title: 'JobeasyO - Find Your Perfect Career Match',
    description: 'AI-powered platform that matches your skills and experience with the perfect job opportunities',
    images: ['/og-image.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobeasyO - AI Career Assistant',
    description: 'Find your perfect job match using AI',
    images: ['/twitter-image.jpg'],
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#FFFFFF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" type="image/svg+xml" href="/UVMark-Color.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="bg-white text-gray-800 min-h-screen overflow-x-hidden antialiased selection:bg-[rgb(var(--primary-blue))/15] selection:text-[rgb(var(--primary-blue))]">
        <ErrorBoundary>
          <ToastProvider>
            <div className="relative min-h-screen flex flex-col">
              <main className="flex-grow overflow-hidden" id="main-content">
                {children}
              </main>
              <footer className="py-6 text-center text-sm text-gray-500 border-t border-gray-200">
                <p>© {new Date().getFullYear()} JobeasyO - AI Career Assistant</p>
              </footer>
            </div>
          </ToastProvider>
        </ErrorBoundary>
        
        {/* Skip to content link for accessibility */}
        <a 
          href="#main-content" 
          className="fixed top-0 left-0 p-3 m-3 -translate-y-full focus:translate-y-0 bg-[rgb(var(--primary-blue))] text-white z-50 transition-transform"
        >
          Skip to content
        </a>
      </body>
    </html>
  );
}
