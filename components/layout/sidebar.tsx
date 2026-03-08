import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Inbox, 
  FileText, 
  Settings, 
  LogOut,
  Briefcase
} from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-muted/20 h-screen hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 font-extrabold text-xl tracking-tighter border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <span>Get A Job Man</span>
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <Button variant="secondary" className="w-full justify-start" asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" asChild>
          <Link href="/dashboard/queue">
            <Inbox className="mr-2 h-4 w-4" />
            Job Queue
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" asChild>
          <Link href="/dashboard/history">
            <FileText className="mr-2 h-4 w-4" />
            Applications
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" asChild>
          <Link href="/dashboard/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
      </nav>

      <div className="p-4 border-t">
        <Button variant="outline" className="w-full justify-start text-muted-foreground" asChild>
          <Link href="/auth/login">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Link>
        </Button>
      </div>
    </aside>
  );
}
