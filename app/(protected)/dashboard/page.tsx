import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Target, TrendingDown, Zap, Settings2, Inbox } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, <span className="font-medium text-foreground">{user.email}</span>. Let's get you hired.
          </p>
        </div>
        <Button size="lg" className="font-bold">
          <Zap className="mr-2 h-4 w-4 fill-current" />
          Scan New Jobs
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Applied</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">+0 from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews Secured</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Conversion rate: 0%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejections</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Dodged bullets</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Job Queue</CardTitle>
          <p className="text-sm text-muted-foreground">
            Jobs waiting for your review. Swipe or approve to auto-apply.
          </p>
        </CardHeader>
        <CardContent className="h-64 flex flex-col items-center justify-center border-t border-dashed m-6 rounded-lg bg-muted/10">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-muted rounded-full">
              <Inbox className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">Your queue is empty.</p>
            <Button variant="outline" size="sm">
              <Settings2 className="mr-2 h-4 w-4" />
              Configure Filters
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
