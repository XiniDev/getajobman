"use client";

import { useState } from "react";
import { saveProject, deleteProject } from "@/lib/actions/cv-crud";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export function ProjectModal({ children, project }: { children: React.ReactNode, project?: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    try {
      if (project?.id) formData.append("id", project.id);
      await saveProject(formData);
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
          <DialogTitle>{project ? "Edit Project" : "Add Project"}</DialogTitle>
        </DialogHeader>

        <form action={onSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="project_name">Project Name</Label>
            <Input id="project_name" name="project_name" defaultValue={project?.project_name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tech_stack">Tech Stack (Comma separated)</Label>
            <Input id="tech_stack" name="tech_stack" defaultValue={project?.tech_stack?.join(", ")} placeholder="React, Node.js, Tailwind..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={5} defaultValue={project?.description} />
          </div>

          <DialogFooter className="flex justify-between items-center w-full sm:justify-between pt-4 border-t">
            {project ? (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={async () => {
                  const fd = new FormData();
                  fd.append("id", project.id);
                  await deleteProject(fd);
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
