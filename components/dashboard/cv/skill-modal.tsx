"use client";

import { useState } from "react";
import { saveSkill, deleteSkill } from "@/lib/actions/cv-crud";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export function SkillModal({ children, skillGroup }: { children: React.ReactNode, skillGroup?: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    try {
      if (skillGroup?.id) formData.append("id", skillGroup.id);
      await saveSkill(formData);
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
          <DialogTitle>{skillGroup ? "Edit Skills" : "Add Skill Category"}</DialogTitle>
        </DialogHeader>

        <form action={onSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" defaultValue={skillGroup?.category} placeholder="e.g. Languages, Frameworks..." required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (Comma separated)</Label>
            <Input id="skills" name="skills" defaultValue={skillGroup?.skills?.join(", ")} placeholder="Python, JavaScript, SQL..." required />
          </div>
          
          <DialogFooter className="flex justify-between items-center w-full sm:justify-between pt-4 border-t">
            {skillGroup ? (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={async () => {
                  const fd = new FormData();
                  fd.append("id", skillGroup.id);
                  await deleteSkill(fd);
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
