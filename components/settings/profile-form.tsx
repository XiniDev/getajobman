"use client";

import { useState } from "react";
import { updateProfile } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Profile } from "@/lib/types";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    try {
      await updateProfile(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input 
            id="first_name" 
            name="first_name" 
            defaultValue={profile?.first_name || ""} 
            placeholder="John" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="middle_name">Middle Name</Label>
          <Input 
            id="middle_name" 
            name="middle_name" 
            defaultValue={profile?.middle_name || ""} 
            placeholder="Edward" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input 
            id="last_name" 
            name="last_name" 
            defaultValue={profile?.last_name || ""} 
            placeholder="Doe" 
          />
        </div>
      </div>

      <div className="space-y-2 max-w-md">
        <Label htmlFor="preferred_name">Preferred Name (Optional)</Label>
        <Input 
          id="preferred_name" 
          name="preferred_name" 
          defaultValue={profile?.preferred_name || ""} 
          placeholder="Johnny" 
        />
        <p className="text-xs text-muted-foreground">
          If provided, the AI will use this name in your cover letters instead of your legal first name.
        </p>
      </div>
      
      <Button type="submit" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
}