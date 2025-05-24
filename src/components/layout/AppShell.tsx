
"use client";
import type { ReactNode } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LayoutDashboard, Store, Archive, IndianRupee, Users, ShieldAlert, UserCircle, Menu, Loader2 } from "lucide-react";
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/restaurants", label: "Restaurants", icon: Store },
  { href: "/inventory", label: "Inventory", icon: Archive },
  { href: "/pricing", label: "Pricing", icon: IndianRupee },
  { href: "/users", label: "Users", icon: Users },
  { href: "/fraud-detection", label: "Fraud Detection", icon: ShieldAlert },
];

interface AppShellProps {
  children: ReactNode;
  pageTitle: string;
}

export function AppShell({ children, pageTitle }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout, userName, isLoading: authIsLoading } = useAuth();

  useEffect(() => {
    if (!authIsLoading && !isAuthenticated && pathname !== '/login') {
      router.replace('/login');
    }
  }, [isAuthenticated, authIsLoading, router, pathname]);

  if (authIsLoading || (!authIsLoading && !isAuthenticated && pathname !== '/login')) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // If on the login page and not authenticated, LoginPage component handles rendering.
  // AppShell should not render its main structure if the user is not authenticated 
  // and is being redirected or is on a page that doesn't use AppShell.
  // The checks above handle the loader/redirect. If we pass them, isAuthenticated must be true.

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar className="hidden border-r bg-sidebar text-sidebar-foreground md:block" collapsible="icon" variant="sidebar">
          <SidebarHeader className="p-4">
            <Button variant="ghost" className="w-full justify-start gap-2 px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-2" asChild>
              <Link href="/dashboard" className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="M15.5 2.897A7.5 7.5 0 0 1 20.103 12h-2.607a4.903 4.903 0 0 0-3-4.196V2.897zM12 4.39a7.5 7.5 0 0 1 7.103 6.103H12V4.39zM3.897 12A7.5 7.5 0 0 1 12 4.897v2.607A4.903 4.903 0 0 0 7.804 10.5H3.897zM12 19.61a7.5 7.5 0 0 1-7.103-6.103H12v6.103zM8.5 14.804A4.903 4.903 0 0 0 12 17.103v2.607A7.5 7.5 0 0 1 3.897 12H6.5a4.903 4.903 0 0 0 2 2.804z"></path><circle cx="12" cy="12" r="2.5"></circle></svg>
                <span className="text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">MenuMaster</span>
              </Link>
            </Button>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                    tooltip={{children: item.label, side: 'right'}}
                  >
                    <Link href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all">
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
            <SidebarTrigger className="md:hidden" >
              <Menu className="h-6 w-6"/>
            </SidebarTrigger>
            <div className="flex-1 overflow-hidden"> {/* Added overflow-hidden here */}
              <h1 className="text-lg font-semibold md:text-xl truncate">{pageTitle}</h1> {/* Added truncate */}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserCircle className="h-6 w-6" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{userName || 'Admin Account'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <SidebarInset className="flex-1">
            <main className="p-4 sm:p-6">{children}</main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
