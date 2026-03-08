"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Inbox, 
  FileText, 
  Settings, 
  Briefcase
} from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Job Queue", href: "/dashboard/queue", icon: Inbox },
    { name: "Applications", href: "/dashboard/history", icon: FileText },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r bg-muted/20 h-screen hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 font-extrabold text-xl tracking-tighter border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <span>Get A Job Man</span>
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Button 
              key={item.name}
              variant={isActive ? "secondary" : "ghost"} 
              className={`w-full justify-start ${!isActive && "text-muted-foreground hover:text-foreground"}`}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <LogoutButton />
      </div>
    </aside>
  );
}
