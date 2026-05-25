import Link from 'next/link';
import { BookOpen, Database, Settings, BarChart3 } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin/stories', label: 'Stories', icon: BookOpen },
  { href: '/admin/datasets', label: 'Datasets', icon: Database },
  { href: '/admin/pipeline', label: 'Pipeline', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-muted/30 flex flex-col">
      <div className="p-6 font-bold text-lg tracking-tight border-b">
        Admin Console
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors"
          >
            <item.icon className="h-4 w-4 text-muted-foreground" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}