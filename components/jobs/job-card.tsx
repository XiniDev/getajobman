"use client";

import { useState } from "react";
import { Job, JobStatus } from "@/lib/types"; 
import { deleteJob } from "@/actions/jobs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Building2, ExternalLink, Trash2, FileCheck } from "lucide-react";
import Link from "next/link";
import { EditJobModal } from "./edit-job-modal";
import { ViewJobModal } from "./view-job-modal";

const statusConfig: Record<JobStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string }> = {
  saved: { 
    label: "Saved", 
    variant: "secondary" 
  },
  drafting: { 
    label: "Drafting", 
    variant: "secondary", 
    className: "bg-amber-100 text-amber-800 hover:bg-amber-100/80 dark:bg-amber-900/30 dark:text-amber-400" 
  },
  applied: { 
    label: "Applied", 
    variant: "default", 
    className: "bg-blue-500 hover:bg-blue-600 text-white" 
  },
  assessment: { 
    label: "Assessment", 
    variant: "default", 
    className: "bg-purple-500 hover:bg-purple-600 text-white" 
  },
  interviewing: { 
    label: "Interviewing", 
    variant: "default", 
    className: "bg-indigo-500 hover:bg-indigo-600 text-white" 
  },
  offer: { 
    label: "Offer!", 
    variant: "default", 
    className: "bg-emerald-500 hover:bg-emerald-600 text-white" 
  },
  rejected: { 
    label: "Rejected", 
    variant: "destructive" 
  },
  ghosted: { 
    label: "Ghosted", 
    variant: "outline", 
    className: "text-muted-foreground border-dashed" 
  },
  withdrawn: { 
    label: "Withdrawn", 
    variant: "outline", 
    className: "text-muted-foreground" 
  },
};export function JobCard({ job }: { job: Job }) {
  const [viewOpen, setViewOpen] = useState(false);
  
  const isProcessing = job.company_name === "Scraping...";
  const currentStatus = statusConfig[job.status] || statusConfig.saved;

  const handleCardClick = (e: React.MouseEvent) => {
    if (isProcessing) return;
    if ((e.target as HTMLElement).closest('button, a')) return;
    setViewOpen(true);
  };

  return (
    <>
      <div 
        onClick={handleCardClick}
        className={`flex items-center justify-between p-4 border rounded-lg bg-card text-card-foreground shadow-sm transition-all ${
          isProcessing 
            ? 'opacity-70 animate-pulse' 
            : 'hover:shadow-md hover:border-primary/30 cursor-pointer'
        }`}
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-lg leading-none">
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
          
          <div className="flex items-center text-muted-foreground text-sm gap-4 mt-1">
            <span className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {job.company_name}
            </span>
            <Link 
              href={job.job_url} 
              target="_blank" 
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View Listing
            </Link>
            {!isProcessing && job.job_description && (
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <FileCheck className="h-4 w-4" />
                Scraped
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isProcessing && <EditJobModal job={job} />}

          <form action={deleteJob}>
            <input type="hidden" name="id" value={job.id} />
            <Button type="submit" variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10 z-10 relative">
              <Trash2 className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {!isProcessing && (
        <ViewJobModal job={job} open={viewOpen} onOpenChange={setViewOpen} />
      )}
    </>
  );
}
