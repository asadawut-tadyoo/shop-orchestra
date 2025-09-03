import { NavLink, useLocation } from 'react-router-dom';
import {
  Package,
  Layers,
  FileText,
  Wrench,
  Factory,
  ClipboardList,
  Activity,
  Box,
  Home,
  LayoutDashboard,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navigation = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Assembly Units',
    href: '/assembly-units',
    icon: Package,
  }, 
  {
    title: 'RMCheck',
    href: '/raw-materials',
    icon: Box,
  },
  {
    title: 'Batches',
    href: '/batches',
    icon: Layers,
  },
  {
    title: 'Work Orders',
    href: '/work-orders',
    icon: ClipboardList,
  },
  {
    title: 'Stations',
    href: '/stations',
    icon: Factory,
  },
  {
    title: 'Bill of Materials',
    href: '/bill-of-materials',
    icon: FileText,
  },
  {
    title: 'Process Steps',
    href: '/process-steps',
    icon: Activity,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 text-sm transition-colors',
                          'hover:bg-sidebar-hover',
                          isActive && 'bg-sidebar-accent text-sidebar-primary font-medium'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}