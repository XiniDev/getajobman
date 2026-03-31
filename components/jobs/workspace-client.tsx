"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateApplicationDocs } from "@/lib/ai/ai-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Building2, ExternalLink, Briefcase } from "lucide-react";
import Link from "next/link";

export function WorkspaceClient({ job }: { job: any }) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const hasDocs = job.cover_letter || job.tailored_resume;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await generateApplicationDocs(job.id);
      router.refresh();
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-8 animate-in fade-in duration-500 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{job.job_title}</h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <Building2 className="h-4 w-4" />
            <span>{job.company_name}</span>
            <span>•</span>
            <span className="capitalize">{job.status}</span>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href={job.job_url} target="_blank" className="flex items-center gap-2">
            View Original Posting <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 flex-1 min-h-0">
        <Card className="flex flex-col h-full overflow-hidden col-span-1">
          <CardHeader className="bg-muted/30 pb-4 shrink-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              Job Description
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="p-6 text-sm text-foreground/80 whitespace-pre-wrap font-mono">
              {job.job_description || "No description provided."}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full overflow-hidden md:col-span-2">
          {hasDocs ? (
            <Tabs defaultValue="resume" className="flex flex-col h-full">
              <CardHeader className="bg-muted/30 pb-4 shrink-0 flex flex-row items-center justify-between">
                <TabsList>
                  <TabsTrigger value="resume">Tailored Resume</TabsTrigger>
                  <TabsTrigger value="cover_letter">Cover Letter</TabsTrigger>
                </TabsList>
                <Button size="sm" variant="secondary">Save Manual Edits</Button>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden">
                <TabsContent value="resume" className="h-full m-0 data-[state=active]:flex flex-col">
                  <Textarea 
                    defaultValue={job.tailored_resume} 
                    className="flex-1 resize-none border-0 focus-visible:ring-0 p-6 font-mono text-sm h-full"
                  />
                </TabsContent>
                <TabsContent value="cover_letter" className="h-full m-0 data-[state=active]:flex flex-col">
                  <Textarea 
                    defaultValue={job.cover_letter} 
                    className="flex-1 resize-none border-0 focus-visible:ring-0 p-6 font-mono text-sm h-full"
                  />
                </TabsContent>
              </CardContent>
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Ready to generate?</CardTitle>
              <CardDescription className="max-w-md">
                The AI will analyze your Master CV and cross-reference it with the Job Description to write a perfectly tailored Resume and Cover Letter.
              </CardDescription>
              <Button onClick={handleGenerate} disabled={isGenerating} size="lg" className="mt-4">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Documents... (This takes about 15s)
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate with AI
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}
