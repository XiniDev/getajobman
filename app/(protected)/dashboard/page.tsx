import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AddJobModal } from "@/components/jobs/add-job-modal";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardJobQueue } from "@/components/dashboard/dashboard-job-queue";

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

      <DashboardStats jobs={jobs} />

      <DashboardJobQueue jobs={jobs} />

    </div>
  );
}
