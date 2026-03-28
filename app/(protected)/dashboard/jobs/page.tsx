import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AddJobModal } from "@/components/jobs/add-job-modal";
import { JobCard } from "@/components/jobs/job-card";
import { Inbox, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function QueuePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/auth/login");

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="w-full max-w-6xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Queue</h1>
          <p className="text-muted-foreground mt-1">
            Review, edit, and manage your saved job opportunities.
          </p>
        </div>
        <AddJobModal />
      </div>

      <div className="space-y-4">
        {jobs && jobs.length > 0 ? (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center border border-dashed rounded-lg bg-muted/10 mt-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-4 bg-muted rounded-full">
                <Inbox className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">Your queue is empty</h3>
              <p className="text-muted-foreground max-w-sm">
                You haven't added any jobs yet. Click the button above to manually add a job, or configure your AI scrapers.
              </p>
              <Button variant="outline" className="mt-2">
                <Settings2 className="mr-2 h-4 w-4" />
                Configure Scrapers
              </Button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
