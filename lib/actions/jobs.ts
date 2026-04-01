"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { extractJobData } from "@/lib/ai/job-extractor";
import { waitUntil } from "@vercel/functions";

export async function addJob(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const job_url = formData.get("job_url") as string;
  const initial_status = (formData.get("status") as string) || "saved";

  const { data: newJob, error: insertError } = await supabase
    .from("jobs")
    .insert({
      user_id: user.id,
      company_name: "Scraping...",
      job_title: "New Position",
      job_url,
      status: initial_status,
      job_description: null,
    })
    .select()
    .single();

  if (insertError) throw new Error("Failed to initialize job slot");

  waitUntil(
    processAILogic(newJob.id, job_url)
  ); 

  revalidatePath("/dashboard");
  return { success: true };
}

async function processAILogic(jobId: string, url: string) {
  const supabase = await createClient();
  let scrapedText = null;

  try {
    console.log(`Background Task Started: Scraping ${url}...`);
    const response = await fetch(`https://r.jina.ai/${url}`, { 
      signal: AbortSignal.timeout(10000) 
    });
    
    if (response.ok) {
      scrapedText = await response.text();
    }

    if (scrapedText) {
      console.log("Background Task: Passing to AI...");
      const aiData = await extractJobData(scrapedText);
      
      if (aiData) {
        console.log("Background Task: Updating Database...");
        await supabase
          .from("jobs")
          .update({
            company_name: aiData.company_name,
            job_title: aiData.job_title,
            job_description: aiData.job_description,
            salary_range: aiData.salary_range,
            location: aiData.location,
            work_model: aiData.work_model,
            employment_type: aiData.employment_type,
            experience_level: aiData.experience_level,
            industry: aiData.industry,
            required_tech_stack: aiData.required_tech_stack,
          })
          .eq("id", jobId);
      } else {
        await supabase.from("jobs").update({ job_description: scrapedText }).eq("id", jobId);
      }
    }
  } catch (e) {
    console.error("Background AI processing failed", e);
  }
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
  const salary_range = formData.get("salary_range") as string | null;
  const location = formData.get("location") as string | null;
  const work_model = formData.get("work_model") as string | null;
  const employment_type = formData.get("employment_type") as string | null;
  const experience_level = formData.get("experience_level") as string | null;
  const industry = formData.get("industry") as string | null;
  const techStackString = formData.get("required_tech_stack") as string | null;
  let required_tech_stack: string[] = [];
  if (techStackString) {
    required_tech_stack = techStackString.split(',').map(s => s.trim()).filter(Boolean);
  }

  const { error } = await supabase
    .from("jobs")
    .update({ 
      company_name, 
      job_title, 
      job_url,
      status,
      job_description,
      salary_range,
      location,
      work_model,
      employment_type,
      experience_level,
      industry,
      required_tech_stack,
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
