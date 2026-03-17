import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Briefcase, GraduationCap, Code, Sparkles, Building2, Pencil } from "lucide-react";
import { CVUploader } from "@/components/dashboard/cv/cv-uploader";
import { WorkModal } from "@/components/dashboard/cv/work-modal";
import { EducationModal } from "@/components/dashboard/cv/education-modal";
import { ProjectModal } from "@/components/dashboard/cv/project-modal";
import { SkillModal } from "@/components/dashboard/cv/skill-modal";
import { ClearAllButton } from "@/components/dashboard/cv/clear-all-button";

function sortChronologically(arr: any[]) {
  if (!arr) return [];
  return [...arr].sort((a, b) => {
    const parseDate = (dateStr: string, isCurrent: boolean) => {
      if (isCurrent || (dateStr && dateStr.toLowerCase().includes('present'))) return Infinity;
      if (!dateStr) return 0;
      const parsed = new Date(dateStr).getTime();
      return isNaN(parsed) ? 0 : parsed;
    };

    const timeA = parseDate(a.end_date || a.start_date, a.is_current);
    const timeB = parseDate(b.end_date || b.start_date, b.is_current);

    if (timeA === timeB) return 0;
    if (timeA === Infinity) return -1;
    if (timeB === Infinity) return 1;

    return timeB - timeA;
  });
}

export default async function MasterCVPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/auth/login");

  const [
    { data: rawWork },
    { data: rawEducation },
    { data: projects },
    { data: skills }
  ] = await Promise.all([
    supabase.from("cv_work_experience").select("*").eq("user_id", user.id),
    supabase.from("cv_education").select("*").eq("user_id", user.id),
    supabase.from("cv_projects").select("*").eq("user_id", user.id).order('created_at', { ascending: false }),
    supabase.from("cv_skills").select("*").eq("user_id", user.id).order('category', { ascending: true })
  ]);
  
  const work = sortChronologically(rawWork || []);
  const education = sortChronologically(rawEducation || []);

  const hasData = work.length > 0 || education.length > 0 || (projects && projects.length > 0) || (skills && skills.length > 0);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Master CV</h1>
          <p className="text-muted-foreground mt-1">
            Build your "Database of You". The AI will use these blocks to generate highly-tailored applications.
          </p>
        </div>
        
        {hasData && <ClearAllButton />}
      </div>

      <CVUploader />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              Work Experience
            </CardTitle>
            <WorkModal>
              <Button variant="ghost" size="icon"><Plus className="h-4 w-4" /></Button>
            </WorkModal>
          </CardHeader>
          <CardContent className="flex-1">
            {work && work.length > 0 ? (
              <div className="space-y-4">
                {work.map((item) => (
                  <div key={item.id} className="border-b last:border-0 pb-3 last:pb-0">
                    <WorkModal work={item}>
                      <div className="group relative hover:bg-muted/50 p-2 -mx-2 rounded-md transition-colors text-left">
                        <div className="pr-8">
                          <h4 className="font-semibold text-foreground">{item.position_title}</h4>
                          <div className="flex items-center text-sm text-muted-foreground gap-2">
                            <Building2 className="h-3 w-3" />
                            {item.company_name}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.start_date} - {item.is_current || item.end_date?.toLowerCase() === 'present' ? "Present" : item.end_date}
                          </p>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {item.description.replace(/[*-]/g, '')}
                            </p>
                          )}
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-md hover:bg-accent hover:text-accent-foreground text-muted-foreground">
                          <Pencil className="h-4 w-4" />
                        </div>
                      </div>
                    </WorkModal>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No experience added yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              Education
            </CardTitle>
            <EducationModal>
              <Button variant="ghost" size="icon"><Plus className="h-4 w-4" /></Button>
            </EducationModal>
          </CardHeader>
          <CardContent className="flex-1">
            {education && education.length > 0 ? (
              <div className="space-y-4">
                {education.map((item) => (
                  <div key={item.id} className="border-b last:border-0 pb-3 last:pb-0">
                    <EducationModal education={item}>
                      <div className="group relative hover:bg-muted/50 p-2 -mx-2 rounded-md transition-colors text-left">
                        <div className="pr-8">
                          <h4 className="font-semibold text-foreground">{item.institution}</h4>
                          <p className="text-sm text-foreground/80">
                            {item.degree} {item.field_of_study ? `in ${item.field_of_study}` : ""}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-muted-foreground">
                              {item.start_date} - {item.end_date}
                            </p>
                            {item.grade && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                                {item.grade}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-md hover:bg-accent hover:text-accent-foreground text-muted-foreground">
                          <Pencil className="h-4 w-4" />
                        </div>
                      </div>
                    </EducationModal>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No education added yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              Projects
            </CardTitle>
            <ProjectModal>
              <Button variant="ghost" size="icon"><Plus className="h-4 w-4" /></Button>
            </ProjectModal>
          </CardHeader>
          <CardContent className="flex-1">
            {projects && projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((item) => (
                  <div key={item.id} className="border-b last:border-0 pb-3 last:pb-0">
                    <ProjectModal project={item}>
                      <div className="group relative hover:bg-muted/50 p-2 -mx-2 rounded-md transition-colors text-left">
                        <div className="pr-8">
                          <h4 className="font-semibold text-foreground">{item.project_name}</h4>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-1 mb-2 line-clamp-2">
                              {item.description.replace(/[*-]/g, '')}
                            </p>
                          )}
                          {item.tech_stack && item.tech_stack.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.tech_stack.map((tech: string, i: number) => (
                                <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">{tech}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-md hover:bg-accent hover:text-accent-foreground text-muted-foreground">
                          <Pencil className="h-4 w-4" />
                        </div>
                      </div>
                    </ProjectModal>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No projects added yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              Skills & Tools
            </CardTitle>
            <SkillModal>
              <Button variant="ghost" size="icon"><Plus className="h-4 w-4" /></Button>
            </SkillModal>
          </CardHeader>
          <CardContent className="flex-1">
            {skills && skills.length > 0 ? (
              <div className="space-y-4">
                {skills.map((item) => (
                  <div key={item.id} className="border-b last:border-0 pb-3 last:pb-0">
                    <SkillModal skillGroup={item}>
                      <div className="group relative hover:bg-muted/50 p-2 -mx-2 rounded-md transition-colors text-left">
                        <div className="pr-8">
                          <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">{item.category}</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {item.skills && item.skills.map((skill: string, i: number) => (
                              <Badge key={i} variant="outline" className="bg-primary/5">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-md hover:bg-accent hover:text-accent-foreground text-muted-foreground">
                          <Pencil className="h-4 w-4" />
                        </div>
                      </div>
                    </SkillModal>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No skills added yet.</p>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
