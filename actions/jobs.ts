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
  const status = (formData.get("status") as string) || "saved";

  let job_description = null;
  
  try {
    console.log(`Scraping URL: ${job_url}...`);
    const response = await fetch(`https://r.jina.ai/${job_url}`, {
      signal: AbortSignal.timeout(10000) 
    });

    if (response.ok) {
      job_description = await response.text();
      console.log("Successfully scraped job description!");
    } else {
      console.warn("Scraper was blocked or failed. Status:", response.status);
    }
  } catch (error) {
    console.error("Scraping error:", error);
  }

  const { error } = await supabase.from("jobs").insert({
    user_id: user.id,
    company_name,
    job_title,
    job_url,
    status,
    job_description,
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

export async function editJob(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const company_name = formData.get("company_name") as string;
  const job_title = formData.get("job_title") as string;
  const job_url = formData.get("job_url") as string;
  const status = formData.get("status") as string;
  const job_description = formData.get("job_description") as string;

  const { error } = await supabase
    .from("jobs")
    .update({ 
      company_name, 
      job_title, 
      job_url,
      status,
      job_description,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("DB Update Error:", error.message);
    throw new Error("Failed to update job.");
  }

  revalidatePath("/dashboard");
}