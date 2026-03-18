"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const first_name = formData.get("first_name") as string;
  const middle_name = formData.get("middle_name") as string;
  const last_name = formData.get("last_name") as string;
  const preferred_name = formData.get("preferred_name") as string;
  const phone_number = formData.get("phone_number") as string;
  const location = formData.get("location") as string;
  const linkedin_url = formData.get("linkedin_url") as string;
  const github_url = formData.get("github_url") as string;
  const portfolio_url = formData.get("portfolio_url") as string;
  const professional_summary = formData.get("professional_summary") as string;

  const { error } = await supabase
    .from("profiles")
    .update({ 
      first_name,
      middle_name, 
      last_name, 
      preferred_name,
      phone_number,
      location,
      linkedin_url,
      github_url,
      portfolio_url,
      professional_summary,
      updated_at: new Date().toISOString() 
    })
    .eq("id", user.id);

  if (error) {
    console.error("Profile Update Error:", error.message);
    throw new Error("Failed to update profile.");
  }

  revalidatePath("/dashboard/settings");
}
