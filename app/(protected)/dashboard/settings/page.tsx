import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ProfileForm } from "@/components/dashboard/settings/profile-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink, Database, Sparkles } from "lucide-react";

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

        <Card className="border-primary/20 bg-primary/5 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" /> 
              Master CV & AI Data
            </CardTitle>
            <CardDescription>
              Your Master CV has been moved to its own dedicated workspace. Manage your work history, education, and skills there to fuel the AI document generator.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/dashboard/cv" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Go to Master CV Workspace
                <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
      </div>
    </div>
  );
}
