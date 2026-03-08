"use client";

import { Job } from "@/lib/types";
import { deleteJob } from "@/actions/jobs";
import { Button } from "@/components/ui/button";
import { Building2, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { EditJobModal } from "./edit-job-modal";

export function JobCard({ job }: { job: Job }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-lg flex items-center gap-2">
          {job.job_title}
        </h3>
        <div className="flex items-center text-muted-foreground text-sm gap-4">
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
        </div>
      </div>

      <div className="flex items-center gap-2">
        <EditJobModal job={job} />

        <form action={deleteJob}>
          <input type="hidden" name="id" value={job.id} />
          <Button type="submit" variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        </form>
      </div>
      
    </div>
  );
}