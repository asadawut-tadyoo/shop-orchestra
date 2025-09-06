import { Search, User, LogOut, Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface AppHeaderProps {
  onMenuClick?: () => void;
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <header className="h-16 border-b border-border bg-gradient-header sticky top-0 z-40">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-hover" />
          <h1 className="text-xl font-semibold text-sidebar-foreground">
            Shop Floor Management
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Global Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-64 pl-10 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground hover:bg-sidebar-hover"
          >
            <Bell className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground hover:bg-sidebar-hover"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}