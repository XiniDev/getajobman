"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateObject } from 'ai';
import { z } from 'zod';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function generateApplicationDocs(
  jobId: string, 
  options: { resume?: boolean; coverLetter?: boolean } = { resume: true, coverLetter: true }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const { data: job } = await supabase.from("jobs").select("*").eq("id", jobId).single();
  if (!job) return { success: false, error: "Job not found" };

  const [
    { data: profile },
    { data: work },
    { data: education },
    { data: projects },
    { data: skills }
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("cv_work_experience").select("*").eq("user_id", user.id),
    supabase.from("cv_education").select("*").eq("user_id", user.id),
    supabase.from("cv_projects").select("*").eq("user_id", user.id),
    supabase.from("cv_skills").select("*").eq("user_id", user.id)
  ]);

  const masterCV = { profile, work, education, projects, skills };

  const tasks = [];
  if (options.coverLetter) {
    tasks.push("- Write a highly tailored, professional Cover Letter for this specific role. Use a modern, engaging tone. Avoid generic buzzwords.");
  }
  if (options.resume) {
    tasks.push("- Write a Tailored Resume in standard Markdown format.\n  - Filter and select ONLY the most relevant work experience and projects.\n  - Rewrite my bullet points to align exactly with the keywords, required tech stack, and experience level of the job.\n  - Include my contact info (from the profile) at the very top.\n  - Structure it clearly with standard markdown headers (e.g., ## Experience, ## Education).");
  }

  const prompt = `
    You are an elite career coach and executive resume writer. 
    I am providing you with my complete Master CV data (in JSON) and a Job Description.
    
    JOB METADATA (CRITICAL TARGETS):
    - Job Title: ${job.job_title}
    - Company: ${job.company_name}
    - Industry: ${job.industry || 'Not specified'}
    - Target Seniority/Level: ${job.experience_level || 'Not specified'}
    - Required Tech Stack: ${job.required_tech_stack && job.required_tech_stack.length > 0 ? job.required_tech_stack.join(", ") : 'Not specified'}
    
    JOB DESCRIPTION:
    ${job.job_description}
    
    MY MASTER CV:
    ${JSON.stringify(masterCV, null, 2)}
    
    YOUR TASK:
    ${tasks.join("\n")}

    Return the output strictly matching the JSON schema provided.
  `;

  const schemaShape: Record<string, any> = {};
  if (options.coverLetter) {
    schemaShape.cover_letter = z.string().describe("The generated cover letter formatted in Markdown");
  }
  if (options.resume) {
    schemaShape.tailored_resume = z.string().describe("The generated tailored resume formatted in Markdown");
  }

  try {
    const { object } = await generateObject({
      model: openrouter('deepseek/deepseek-v3.2'),
      schema: z.object(schemaShape),
      prompt: prompt,
    });

    const updatePayload: any = { status: 'drafting' };
    if (options.coverLetter && object.cover_letter) updatePayload.cover_letter = object.cover_letter;
    if (options.resume && object.tailored_resume) updatePayload.tailored_resume = object.tailored_resume;

    const { error } = await supabase
      .from("jobs")
      .update(updatePayload)
      .eq("id", jobId)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath(`/dashboard`);
    revalidatePath(`/dashboard/jobs`);
    
    return { success: true };

  } catch (error) {
    console.error("Failed to generate application:", error);
    return { success: false, error: "AI Generation Failed" };
  }
}
