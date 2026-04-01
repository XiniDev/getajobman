"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateApplicationDocs } from "@/lib/ai/ai-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Loader2, Sparkles, Building2, ExternalLink, Briefcase, RefreshCw,
  MapPin, Banknote, Laptop, Briefcase as BriefcaseIcon 
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export function WorkspaceClient({ job }: { job: any }) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenOpen, setIsRegenOpen] = useState(false);
  const [regenResume, setRegenResume] = useState(true);
  const [regenCoverLetter, setRegenCoverLetter] = useState(true);

  const hasDocs = job.cover_letter || job.tailored_resume;

  const handleInitialGenerate = async () => {
    setIsGenerating(true);
    try {
      await generateApplicationDocs(job.id, { resume: true, coverLetter: true });
      toast.success("Documents generated successfully!");
      router.refresh();
    } catch (error: any) {
      toast.error("Generation failed", { description: error.message });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateSubmit = async () => {
    setIsRegenOpen(false);
    setIsGenerating(true);
    try {
      await generateApplicationDocs(job.id, { resume: regenResume, coverLetter: regenCoverLetter });
      toast.success("Selected documents regenerated!");
      router.refresh();
    } catch (error: any) {
      toast.error("Regeneration failed", { description: error.message });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-8 animate-in fade-in duration-500 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 shrink-0">
        <div className="space-y-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{job.job_title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1 text-sm md:text-base">
              <Building2 className="h-4 w-4" />
              <span className="font-medium text-foreground/90">{job.company_name}</span>
              <span>•</span>
              <span className="capitalize">{job.status}</span>
              {job.industry && (
                <>
                  <span>•</span>
                  <span>{job.industry}</span>
                </>
              )}
            </div>
          </div>

          {/* METADATA BADGE ROW */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {job.location && (
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{job.location}</span>
            )}
            {job.salary_range && (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <Banknote className="h-4 w-4" />{job.salary_range}
              </span>
            )}
            {job.work_model && (
              <span className="flex items-center gap-1.5"><Laptop className="h-4 w-4" />{job.work_model}</span>
            )}
            {job.employment_type && (
              <span className="flex items-center gap-1.5"><BriefcaseIcon className="h-4 w-4" />{job.employment_type}</span>
            )}
            {job.experience_level && (
              <span className="flex items-center gap-1.5 border-l pl-4 ml-1 border-muted-foreground/30">
                Level: <span className="font-medium text-foreground/80">{job.experience_level}</span>
              </span>
            )}
          </div>
        </div>

        <Button variant="outline" asChild className="shrink-0">
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
          <CardContent className="flex-1 overflow-y-auto p-0 flex flex-col">
            {job.required_tech_stack && job.required_tech_stack.length > 0 && (
              <div className="p-4 border-b bg-muted/10 shrink-0">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Required Tech Stack</h4>
                <div className="flex flex-wrap gap-1.5">
                  {job.required_tech_stack.map((tech: string, i: number) => (
                    <Badge key={i} variant="secondary" className="font-normal bg-background/50">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 prose prose-sm dark:prose-invert max-w-none text-foreground/80">
              <ReactMarkdown>
                {job.job_description || "No description provided."}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full overflow-hidden md:col-span-2 relative">
          {isGenerating && (
            <div className="absolute inset-0 z-50 bg-background/50 backdrop-blur-sm flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="font-medium text-foreground animate-pulse">Generating Application Documents...</p>
              <p className="text-xs text-muted-foreground mt-1">This usually takes about 15 seconds.</p>
            </div>
          )}

          {hasDocs ? (
            <Tabs defaultValue="resume" className="flex flex-col h-full">
              <CardHeader className="bg-muted/30 pb-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <TabsList>
                  <TabsTrigger value="resume">Tailored Resume</TabsTrigger>
                  <TabsTrigger value="cover_letter">Cover Letter</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <Dialog open={isRegenOpen} onOpenChange={setIsRegenOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" disabled={isGenerating} className="border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20">
                        <RefreshCw className="h-3.5 w-3.5 mr-2" />
                        Regenerate
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-violet-600" />
                          Regenerate Documents
                        </DialogTitle>
                        <DialogDescription>
                          Select which documents to rewrite. <strong>This will permanently overwrite</strong> your current generated text and manual edits.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6 py-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <Label className="text-base">Tailored Resume</Label>
                            <p className="text-xs text-muted-foreground">Re-analyze master CV and job description.</p>
                          </div>
                          <Switch checked={regenResume} onCheckedChange={setRegenResume} />
                        </div>
                        
                        <div className="flex items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <Label className="text-base">Cover Letter</Label>
                            <p className="text-xs text-muted-foreground">Draft a new targeted cover letter.</p>
                          </div>
                          <Switch checked={regenCoverLetter} onCheckedChange={setRegenCoverLetter} />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsRegenOpen(false)}>Cancel</Button>
                        <Button 
                          onClick={handleRegenerateSubmit} 
                          disabled={!regenResume && !regenCoverLetter}
                          className="bg-violet-600 hover:bg-violet-700 text-white"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Regenerate Selected
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button size="sm" variant="secondary">Save Manual Edits</Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-0 overflow-hidden">
                <TabsContent value="resume" className="h-full m-0 data-[state=active]:flex flex-col">
                  <Textarea 
                    key={`resume-${job.tailored_resume?.length || 0}`}
                    defaultValue={job.tailored_resume} 
                    className="flex-1 resize-none border-0 focus-visible:ring-0 p-6 font-mono text-sm h-full"
                    placeholder="No resume generated yet."
                  />
                </TabsContent>
                <TabsContent value="cover_letter" className="h-full m-0 data-[state=active]:flex flex-col">
                  <Textarea 
                    key={`cl-${job.cover_letter?.length || 0}`}
                    defaultValue={job.cover_letter} 
                    className="flex-1 resize-none border-0 focus-visible:ring-0 p-6 font-mono text-sm h-full"
                    placeholder="No cover letter generated yet."
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
              <Button onClick={handleInitialGenerate} disabled={isGenerating} size="lg" className="mt-4 bg-violet-600 hover:bg-violet-700 text-white">
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Documents
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
