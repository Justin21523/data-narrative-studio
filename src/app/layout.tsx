import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Navbar } from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Data Narrative Studio',
  description: 'Transform raw datasets into compelling, interactive data stories.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <Navbar />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}