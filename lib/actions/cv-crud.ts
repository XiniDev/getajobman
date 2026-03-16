"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveWork(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const company_name = formData.get("company_name") as string;
  const position_title = formData.get("position_title") as string;
  const start_date = formData.get("start_date") as string;
  const is_current = formData.get("is_current") === "on";
  const end_date = is_current ? "" : (formData.get("end_date") as string);
  const description = formData.get("description") as string;

  const payload = {
    user_id: user.id,
    company_name,
    position_title,
    start_date,
    end_date,
    is_current,
    description,
  };

  if (id) {
    await supabase.from("cv_work_experience").update(payload).eq("id", id).eq("user_id", user.id);
  } else {
    await supabase.from("cv_work_experience").insert(payload);
  }

  revalidatePath("/dashboard/cv");
}

export async function deleteWork(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  await supabase.from("cv_work_experience").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard/cv");
}

export async function saveEducation(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const payload = {
    user_id: user.id,
    institution: formData.get("institution") as string,
    degree: formData.get("degree") as string,
    field_of_study: formData.get("field_of_study") as string,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
    grade: formData.get("grade") as string,
  };

  if (id) await supabase.from("cv_education").update(payload).eq("id", id).eq("user_id", user.id);
  else await supabase.from("cv_education").insert(payload);
  revalidatePath("/dashboard/cv");
}

export async function deleteEducation(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  await supabase.from("cv_education").delete().eq("id", formData.get("id")).eq("user_id", user.id);
  revalidatePath("/dashboard/cv");
}

export async function saveProject(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const techStackString = formData.get("tech_stack") as string;
  
  const payload = {
    user_id: user.id,
    project_name: formData.get("project_name") as string,
    description: formData.get("description") as string,
    project_url: formData.get("project_url") as string,
    tech_stack: techStackString ? techStackString.split(",").map(s => s.trim()).filter(Boolean) : [],
  };

  if (id) await supabase.from("cv_projects").update(payload).eq("id", id).eq("user_id", user.id);
  else await supabase.from("cv_projects").insert(payload);
  revalidatePath("/dashboard/cv");
}

export async function deleteProject(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  await supabase.from("cv_projects").delete().eq("id", formData.get("id")).eq("user_id", user.id);
  revalidatePath("/dashboard/cv");
}

export async function saveSkill(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const skillsString = formData.get("skills") as string;

  const payload = {
    user_id: user.id,
    category: formData.get("category") as string,
    skills: skillsString ? skillsString.split(",").map(s => s.trim()).filter(Boolean) : [],
  };

  if (id) await supabase.from("cv_skills").update(payload).eq("id", id).eq("user_id", user.id);
  else await supabase.from("cv_skills").insert(payload);
  revalidatePath("/dashboard/cv");
}

export async function deleteSkill(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  await supabase.from("cv_skills").delete().eq("id", formData.get("id")).eq("user_id", user.id);
  revalidatePath("/dashboard/cv");
}

export async function clearAllCVData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await Promise.all([
    supabase.from("cv_work_experience").delete().eq("user_id", user.id),
    supabase.from("cv_education").delete().eq("user_id", user.id),
    supabase.from("cv_projects").delete().eq("user_id", user.id),
    supabase.from("cv_skills").delete().eq("user_id", user.id),
  ]);

  revalidatePath("/dashboard/cv");
}