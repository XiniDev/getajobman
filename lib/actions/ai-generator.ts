"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateObject } from 'ai';
import { z } from 'zod';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function generateApplicationDocs(jobId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: job } = await supabase.from("jobs").select("*").eq("id", jobId).single();
  if (!job) throw new Error("Job not found");

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

  const prompt = `
    You are an elite career coach and executive resume writer. 
    I am providing you with my complete Master CV data (in JSON) and a Job Description.
    
    JOB DESCRIPTION:
    ${job.job_description}
    
    MY MASTER CV:
    ${JSON.stringify(masterCV, null, 2)}
    
    YOUR TASK:
    1. Write a highly tailored, professional Cover Letter for this specific role. Use a modern, engaging tone. Avoid generic buzzwords.
    2. Write a Tailored Resume in standard Markdown format. 
       - Filter and select ONLY the most relevant work experience and projects.
       - Rewrite my bullet points to align exactly with the keywords and requirements in the job description.
       - Include my contact info (from the profile) at the very top.
       - Structure it clearly with standard markdown headers (e.g., ## Experience, ## Education).

    Return the output strictly matching the JSON schema provided.
  `;

  try {
    const { object } = await generateObject({
      model: openrouter('deepseek/deepseek-v3.2'),
      schema: z.object({
        cover_letter: z.string().describe("The generated cover letter formatted in Markdown"),
        tailored_resume: z.string().describe("The generated tailored resume formatted in Markdown")
      }),
      prompt: prompt,
    });

    const { error } = await supabase
      .from("jobs")
      .update({
        cover_letter: object.cover_letter,
        tailored_resume: object.tailored_resume,
        status: 'drafting'
      })
      .eq("id", jobId)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath(`/dashboard`);
    revalidatePath(`/dashboard/queue`);
    
    return { success: true };

  } catch (error) {
    console.error("Failed to generate application:", error);
    return { success: false, error: "AI Generation Failed" };
  }
}
