"use client";

import { useState } from "react";
import { saveWork, deleteWork } from "@/lib/actions/cv-crud";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export function WorkModal({ children, work }: { children: React.ReactNode, work?: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCurrent, setIsCurrent] = useState(work?.is_current || false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    try {
      if (work?.id) formData.append("id", work.id);
      await saveWork(formData);
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
        <div className="cursor-pointer">
          {children}
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{work ? "Edit Work Experience" : "Add Work Experience"}</DialogTitle>
        </DialogHeader>

        <form action={onSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input id="company_name" name="company_name" defaultValue={work?.company_name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position_title">Job Title</Label>
              <Input id="position_title" name="position_title" defaultValue={work?.position_title} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-start">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date (e.g. Jan 2020)</Label>
              <Input id="start_date" name="start_date" defaultValue={work?.start_date} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input id="end_date" name="end_date" defaultValue={work?.end_date} disabled={isCurrent} />
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="is_current" 
                  name="is_current" 
                  checked={isCurrent} 
                  onCheckedChange={(checked) => setIsCurrent(checked === true)} 
                />
                <Label htmlFor="is_current" className="text-sm font-normal">I currently work here</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Markdown Supported)</Label>
            <Textarea 
              id="description" 
              name="description" 
              rows={6} 
              defaultValue={work?.description} 
              placeholder="- Achieved X by doing Y..."
            />
          </div>

          <DialogFooter className="flex justify-between items-center w-full sm:justify-between pt-4 border-t">
            {work ? (
              <Button 
                type="button" 
                variant="destructive" 
                size="icon"
                onClick={async () => {
                  const fd = new FormData();
                  fd.append("id", work.id);
                  await deleteWork(fd);
                  setOpen(false);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            ) : (
              <div />
            )}

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}