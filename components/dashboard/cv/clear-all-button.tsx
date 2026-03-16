"use client";

import { useState } from "react";
import { clearAllCVData } from "@/lib/actions/cv-crud";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ClearAllButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClear = async () => {
    setLoading(true);
    try {
      await clearAllCVData();
      setOpen(false);
    } catch (error) {
      console.error("Failed to clear data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear All Data
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Clear Master CV?
          </DialogTitle>
          <DialogDescription className="pt-2 text-foreground/80">
            Are you absolutely sure you want to delete your entire Master CV? This will instantly erase all your work experience, education, projects, and skills.
            <br /><br />
            <strong className="text-foreground">This action cannot be undone.</strong>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex gap-2 sm:justify-end mt-4 border-t pt-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleClear} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Yes, Clear Everything
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
