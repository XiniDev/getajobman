"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { extractCVData } from "@/lib/ai/cv-extractor";
import { PDFParse } from "pdf-parse";

export async function uploadAndParseCV(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    const rawText = result.text;

    if (typeof parser.destroy === 'function') {
      await parser.destroy();
    }

    if (!rawText || rawText.trim().length === 0) {
      throw new Error("Could not extract text from PDF.");
    }

    const aiData = await extractCVData(rawText);
    if (!aiData) throw new Error("AI failed to parse resume. Check server logs.");

    if (aiData.profile) {
      await supabase.from("profiles").update({
        phone_number: aiData.profile.phone_number,
        location: aiData.profile.location,
        linkedin_url: aiData.profile.linkedin_url,
        github_url: aiData.profile.github_url,
        portfolio_url: aiData.profile.portfolio_url,
        professional_summary: aiData.profile.professional_summary,
      }).eq("id", user.id);
    }

    if (aiData.work && aiData.work.length > 0) {
      const workData = aiData.work.map((w: any) => ({ ...w, user_id: user.id }));
      await supabase.from("cv_work_experience").insert(workData);
    }

    if (aiData.education && aiData.education.length > 0) {
      const eduData = aiData.education.map((e: any) => ({ ...e, user_id: user.id }));
      await supabase.from("cv_education").insert(eduData);
    }

    if (aiData.projects && aiData.projects.length > 0) {
      const projData = aiData.projects.map((p: any) => ({ ...p, user_id: user.id }));
      await supabase.from("cv_projects").insert(projData);
    }

    if (aiData.skills && aiData.skills.length > 0) {
      const skillData = aiData.skills.map((s: any) => ({ ...s, user_id: user.id }));
      await supabase.from("cv_skills").insert(skillData);
    }

    revalidatePath("/dashboard/cv");
    return { success: true };

  } catch (error: any) {
    console.error("CV Upload Error:", error);
    return { error: error.message || "Failed to process CV" };
  }
}
