import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Plus, Briefcase, GraduationCap, Code, Sparkles } from "lucide-react";

export default async function MasterCVPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/auth/login");
  
  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Master CV</h1>
          <p className="text-muted-foreground mt-1">
            Build your "Database of You". The AI will use these blocks to generate highly-tailored applications.
          </p>
        </div>
      </div>

      <Card className="border-primary/50 bg-primary/5 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Resume Import
          </CardTitle>
          <CardDescription>
            Upload your existing PDF resume. Our AI will automatically extract your experience, education, and skills into the database blocks below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 flex flex-col items-center justify-center text-center bg-background/50 hover:bg-background/80 transition-colors cursor-pointer">
            <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg">Click to upload PDF</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Max file size 5MB.
            </p>
            <Button>Select File</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              Work Experience
            </CardTitle>
            <Button variant="ghost" size="icon"><Plus className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">No experience added yet.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              Education
            </CardTitle>
            <Button variant="ghost" size="icon"><Plus className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">No education added yet.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              Projects
            </CardTitle>
            <Button variant="ghost" size="icon"><Plus className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">No projects added yet.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              Skills & Tools
            </CardTitle>
            <Button variant="ghost" size="icon"><Plus className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">No skills added yet.</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
