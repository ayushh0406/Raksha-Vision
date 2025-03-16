import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { ThemeProvider } from '@/lib/theme';
import { AuthProvider } from '@/lib/auth';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Border Surveillance System',
  description: 'AI and Multi-Sensor Fusion for Border Intrusion Detection',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>
        <ThemeProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <footer className="bg-white dark:bg-dark-900 py-4 border-t border-dark-200 dark:border-dark-700 theme-transition">
                <div className="container mx-auto px-4 text-center text-dark-500 dark:text-dark-400">
                  <p>© {new Date().getFullYear()} Border Surveillance System. All rights reserved.</p>
                </div>
              </footer>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 