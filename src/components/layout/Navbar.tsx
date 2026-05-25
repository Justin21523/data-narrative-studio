'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Database, Compass, Settings } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2 font-bold tracking-tight">
          <Database className="h-5 w-5" />
          <span>Data Narrative Studio</span>
        </Link>
        <div className="flex flex-1 items-center space-x-2">
          <Link href="/explore">
            <Button variant="ghost" size="sm">
              <Compass className="mr-2 h-4 w-4" /> Explore
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <Settings className="mr-2 h-4 w-4" /> Admin
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}