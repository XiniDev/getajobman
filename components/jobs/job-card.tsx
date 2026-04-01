"use client";

import { useRouter } from "next/navigation";
import { Job, JobStatus } from "@/lib/types"; 
import { deleteJob } from "@/lib/actions/jobs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, Building2, ExternalLink, Trash2, FileCheck, Sparkles,
  MapPin, Banknote, Laptop, Briefcase as BriefcaseIcon 
} from "lucide-react";
import Link from "next/link";
import { EditJobModal } from "./edit-job-modal";

const statusConfig: Record<JobStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string }> = {
  saved: { label: "Saved", variant: "secondary" },
  drafting: { label: "Drafting", variant: "secondary", className: "bg-amber-100 text-amber-800 hover:bg-amber-100/80 dark:bg-amber-900/30 dark:text-amber-400" },
  applied: { label: "Applied", variant: "default", className: "bg-blue-500 hover:bg-blue-600 text-white" },
  assessment: { label: "Assessment", variant: "default", className: "bg-purple-500 hover:bg-purple-600 text-white" },
  interviewing: { label: "Interviewing", variant: "default", className: "bg-indigo-500 hover:bg-indigo-600 text-white" },
  offer: { label: "Offer!", variant: "default", className: "bg-emerald-500 hover:bg-emerald-600 text-white" },
  rejected: { label: "Rejected", variant: "destructive" },
  ghosted: { label: "Ghosted", variant: "outline", className: "text-muted-foreground border-dashed" },
  withdrawn: { label: "Withdrawn", variant: "outline", className: "text-muted-foreground" },
};

export function JobCard({ job }: { job: Job }) {
  const router = useRouter();
  
  const isProcessing = job.company_name === "Scraping...";
  const currentStatus = statusConfig[job.status] || statusConfig.saved;

  const handleCardClick = (e: React.MouseEvent) => {
    if (isProcessing) return;
    if ((e.target as HTMLElement).closest('button, a, [role="dialog"]')) return;
    router.push(`/dashboard/jobs/${job.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`flex flex-col sm:flex-row sm:items-start justify-between p-4 border rounded-lg bg-card text-card-foreground shadow-sm transition-all gap-4 ${
        isProcessing ? 'opacity-70 animate-pulse' : 'hover:shadow-md hover:border-primary/30 cursor-pointer'
      }`}
    >
      <div className="flex flex-col gap-2 overflow-hidden flex-1">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-lg leading-none truncate">
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing Listing...
              </span>
            ) : job.job_title}
          </h3>
          <Badge variant={currentStatus.variant} className={currentStatus.className}>
            {currentStatus.label}
          </Badge>
        </div>
        
        <div className="flex items-center text-muted-foreground text-sm gap-4">
          <span className="flex items-center gap-1 truncate font-medium text-foreground/80">
            <Building2 className="h-4 w-4 shrink-0" />
            {job.company_name}
          </span>
        </div>

        {!isProcessing && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1 text-xs text-muted-foreground">
            {job.location && (
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
            )}
            {job.salary_range && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium"><Banknote className="h-3.5 w-3.5" />{job.salary_range}</span>
            )}
            {job.work_model && (
              <span className="flex items-center gap-1"><Laptop className="h-3.5 w-3.5" />{job.work_model}</span>
            )}
            {job.employment_type && (
              <span className="flex items-center gap-1"><BriefcaseIcon className="h-3.5 w-3.5" />{job.employment_type}</span>
            )}
          </div>
        )}

        {!isProcessing && job.required_tech_stack && job.required_tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {job.required_tech_stack.slice(0, 6).map((tech, i) => (
              <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0 bg-muted/50 font-normal">
                {tech}
              </Badge>
            ))}
            {job.required_tech_stack.length > 6 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-muted/50 font-normal">
                +{job.required_tech_stack.length - 6} more
              </Badge>
            )}
          </div>
        )}
      </div>

      <div 
        className="flex items-center sm:flex-col sm:items-end gap-2 relative z-10 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          {!isProcessing && (
            <Button variant="secondary" size="sm" asChild className="hidden sm:flex gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary border-0">
              <Link href={`/dashboard/jobs/${job.id}`}>
                <Sparkles className="h-3.5 w-3.5" />
                Workspace
              </Link>
            </Button>
          )}

          {!isProcessing && <EditJobModal job={job} />}

          <form action={deleteJob}>
            <input type="hidden" name="id" value={job.id} />
            <Button type="submit" variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto sm:mt-2">
          <Link 
            href={job.job_url} 
            target="_blank" 
            className="flex items-center gap-1 hover:text-primary transition-colors whitespace-nowrap"
          >
            <ExternalLink className="h-3 w-3" />
            Post
          </Link>
          {!isProcessing && job.job_description && (
            <span className="flex items-center gap-1 text-emerald-600 font-medium whitespace-nowrap">
              <FileCheck className="h-3 w-3" />
              AI Extracted
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
