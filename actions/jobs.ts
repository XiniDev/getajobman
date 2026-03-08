"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addJob(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const company_name = formData.get("company_name") as string;
  const job_title = formData.get("job_title") as string;
  const job_url = formData.get("job_url") as string;

  const { error } = await supabase.from("jobs").insert({
    user_id: user.id,
    company_name,
    job_title,
    job_url,
  });

  if (error) {
    console.error("DB Insert Error:", error.message);
    throw new Error("Failed to add job.");
  }

  revalidatePath("/dashboard");
}

export async function deleteJob(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const jobId = formData.get("id") as string;

  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", jobId)
    .eq("user_id", user.id);

  if (error) {
    console.error("DB Delete Error:", error.message);
    throw new Error("Failed to delete job.");
  }

  revalidatePath("/dashboard");
}