"use client";

import { useState } from "react";
import { Job } from "@/lib/types";
import { editJob } from "@/actions/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Loader2 } from "lucide-react";

export function EditJobModal({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    try {
      await editJob(formData);
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form action={onSubmit}>
          <input type="hidden" name="id" value={job.id} />
          
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>
              Update the details, status, and description for this position.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input id="company_name" name="company_name" defaultValue={job.company_name} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="job_title">Job Title</Label>
                <Input id="job_title" name="job_title" defaultValue={job.job_title} required />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job_url">Job URL</Label>
                <Input id="job_url" name="job_url" type="url" defaultValue={job.job_url} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Application Status</Label>
                <Select name="status" defaultValue={job.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="saved">Saved</SelectItem>
                    <SelectItem value="drafting">Drafting</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="assessment">Assessment</SelectItem>
                    <SelectItem value="interviewing">Interviewing</SelectItem>
                    <SelectItem value="offer">Offer!</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="ghosted">Ghosted</SelectItem>
                    <SelectItem value="withdrawn">Withdrawn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_description">Job Description</Label>
              <Textarea 
                id="job_description" 
                name="job_description" 
                defaultValue={job.job_description || ""} 
                placeholder="Paste the job description here..." 
                className="min-h-[200px]"
              />
              <p className="text-xs text-muted-foreground">
                Edit out any junk text so the AI Cover Letter generator focuses on the real requirements.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}