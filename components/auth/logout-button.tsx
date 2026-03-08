"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh(); 
    router.push("/auth/login");
  };

  return (
    <Button 
      variant="outline" 
      className="w-full justify-start text-muted-foreground hover:text-foreground" 
      onClick={logout}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}