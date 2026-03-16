"use client";

import { useState } from "react";
import { saveEducation, deleteEducation } from "@/lib/actions/cv-crud";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export function EducationModal({ children, education }: { children: React.ReactNode, education?: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    if (education?.id) formData.append("id", education.id);
    await saveEducation(formData);
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader><DialogTitle>{education ? "Edit Education" : "Add Education"}</DialogTitle></DialogHeader>
        <form action={onSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="institution">Institution / University</Label>
            <Input id="institution" name="institution" defaultValue={education?.institution} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="degree">Degree</Label>
              <Input id="degree" name="degree" defaultValue={education?.degree} placeholder="e.g. B.S." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field_of_study">Field of Study</Label>
              <Input id="field_of_study" name="field_of_study" defaultValue={education?.field_of_study} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input id="start_date" name="start_date" defaultValue={education?.start_date} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input id="end_date" name="end_date" defaultValue={education?.end_date} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="grade">Grade / GPA</Label>
            <Input id="grade" name="grade" defaultValue={education?.grade} />
          </div>
          <DialogFooter className="flex justify-between items-center w-full sm:justify-between pt-4 border-t">
            {education ? (
              <Button type="button" variant="destructive" size="icon" onClick={async () => { const fd = new FormData(); fd.append("id", education.id); await deleteEducation(fd); setOpen(false); }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            ) : <div />}
            <Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
