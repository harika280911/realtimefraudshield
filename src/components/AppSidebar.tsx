import { cn } from '@/lib/utils';
import { Shield, BarChart3, Bell, Settings, Activity } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const navItems = [
  { icon: Activity, label: 'Dashboard', href: '/' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: Bell, label: 'Alerts', href: '/alerts' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="w-60 shrink-0 border-r border-border bg-sidebar flex flex-col h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <Shield className="h-6 w-6 text-destructive" />
        <span className="text-base font-semibold tracking-tight text-foreground">FraudShield</span>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map((item) => {
          const active = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                active
                  ? 'bg-sidebar-accent text-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-border">
        <div className="label-upper mb-1">System</div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-muted-foreground">Monitoring Active</span>
        </div>
      </div>
    </aside>
  );
}
