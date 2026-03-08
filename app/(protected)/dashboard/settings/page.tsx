import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/settings/profile-form";

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="pb-4 border-b">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your name. This will be used when the AI generates your cover letters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm profile={profile} />
          </CardContent>
        </Card>

        {/* AI Settings card here later for Master CV text */}
        <Card className="opacity-50 pointer-events-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">🤖</span> AI Preferences
            </CardTitle>
            <CardDescription>
              Upload your Master CV and set your desired tone. (TBA SOON!)
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

    </div>
  );
}
