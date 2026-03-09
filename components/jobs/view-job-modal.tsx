"use client";

import { Job } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ExternalLink, Building2 } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export function ViewJobModal({ 
  job, 
  open, 
  onOpenChange 
}: { 
  job: Job; 
  open: boolean; 
  onOpenChange: (open: boolean) => void 
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col p-0 overflow-hidden">
        
        <div className="p-6 border-b bg-muted/30">
          <DialogHeader className="text-left space-y-3">
            <div className="flex items-center justify-between gap-4 pr-6">
              <DialogTitle className="text-2xl font-bold leading-tight">
                {job.job_title}
              </DialogTitle>
            </div>
            <DialogDescription asChild>
              <div className="flex items-center gap-4 text-sm font-medium">
                <span className="flex items-center gap-1.5 text-foreground">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {job.company_name}
                </span>
                <Link 
                  href={job.job_url} 
                  target="_blank" 
                  className="flex items-center gap-1.5 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Original Listing
                </Link>
              </div>
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 overflow-y-auto">
          {job.job_description ? (
            <div className="text-sm text-foreground/90">
              <ReactMarkdown 
                components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4 text-foreground" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground border-b pb-2" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-5 mb-2 text-foreground" {...props} />,
                  p: ({node, ...props}) => <p className="leading-relaxed mb-4" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-1.5 mb-5 marker:text-muted-foreground" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 space-y-1.5 mb-5 marker:text-muted-foreground" {...props} />,
                  li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
                }}
              >
                {job.job_description}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-muted-foreground italic">
              No description available.
            </div>
          )}
        </div>

      </DialogContent>
    </Dialog>
  );
}
