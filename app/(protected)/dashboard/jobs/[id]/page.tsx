import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { WorkspaceClient } from "@/components/jobs/workspace-client";

export default async function JobWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; 

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return redirect("/auth/login");

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!job) return redirect("/dashboard/jobs");

  return <WorkspaceClient job={job} />;
}
