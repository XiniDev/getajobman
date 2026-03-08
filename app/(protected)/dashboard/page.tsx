import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Target, TrendingDown, Inbox, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddJobModal } from "@/components/jobs/add-job-modal";
import { JobCard } from "@/components/jobs/job-card";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, preferred_name")
    .eq("id", user.id)
    .single();

  const displayName = profile?.preferred_name || profile?.first_name || user.email;

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  const totalJobs = jobs?.length || 0;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, <span className="font-medium text-foreground">{displayName}</span>. Let's get you hired.
          </p>
        </div>
        <AddJobModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
            <p className="text-xs text-muted-foreground">Waiting in your queue</p>
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

      <Card className="col-span-1 border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <CardTitle>Job Queue</CardTitle>
          <p className="text-sm text-muted-foreground">
            Jobs waiting for your review.
          </p>
        </CardHeader>
        <CardContent className="px-0 space-y-4">
          {jobs && jobs.length > 0 ? (
            jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="h-48 flex flex-col items-center justify-center border border-dashed rounded-lg bg-muted/10">
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
            </div>
          )}
          
        </CardContent>
      </Card>

    </div>
  );
}
