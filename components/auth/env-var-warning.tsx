import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DatabaseZap, AlertCircle } from "lucide-react";

export function EnvVarWarning() {
  return (
    <div className="flex gap-4 items-center">
      <Badge variant="destructive" className="flex items-center gap-1.5 px-3 py-1 animate-pulse">
        <AlertCircle className="h-3.5 w-3.5" />
        <span className="font-medium tracking-tight">Database Disconnected</span>
      </Badge>
      
      <div className="flex gap-2">
        <Button size="sm" variant="default" disabled className="opacity-50 cursor-not-allowed">
          Sign in
        </Button>
        {/* Sign up is hidden here too */}
        {/* <Button size="sm" variant={"default"} disabled>
          Sign up
        </Button> */}
      </div>
    </div>
  );
}