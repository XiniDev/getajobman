import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/dashboard/settings/profile-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Key, Sparkles, User } from "lucide-react";

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
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your contact details and professional links. This data fuels your AI-generated documents.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm profile={profile} />
          </CardContent>
        </Card>

        <Card className="relative opacity-60 pointer-events-none select-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Generation Preferences
              </CardTitle>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
            <CardDescription>
              Customize how the AI writes your cover letters and resumes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ai_tone">Default Writing Tone</Label>
              <Select defaultValue="professional" disabled>
                <SelectTrigger id="ai_tone" className="w-full md:w-[300px]">
                  <SelectValue placeholder="Select a tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional & Direct</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic & Engaging</SelectItem>
                  <SelectItem value="confident">Confident & Bold</SelectItem>
                  <SelectItem value="creative">Creative & Story-driven</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                You can always override this on individual job applications.
              </p>
            </div>
            <Button variant="secondary" className="mt-2" disabled>Save Preferences</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Account Security
            </CardTitle>
            <CardDescription>
              Manage your authentication details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" value={user.email} disabled className="bg-muted md:w-[300px]" />
              <p className="text-xs text-muted-foreground mt-1">
                Your email is tied to your authentication provider.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/50 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-destructive/5 p-4 rounded-md border border-destructive/20">
              <div className="space-y-1">
                <h4 className="font-medium text-foreground">Delete Account</h4>
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. All tracked jobs and Master CV data will be wiped.
                </p>
              </div>
              <Button variant="destructive" className="whitespace-nowrap">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
