"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;

  const { error } = await supabase
    .from("profiles")
    .update({ 
      first_name, 
      last_name, 
      updated_at: new Date().toISOString() 
    })
    .eq("id", user.id);

  if (error) {
    console.error("Profile Update Error:", error.message);
    throw new Error("Failed to update profile.");
  }

  revalidatePath("/dashboard/settings");
}