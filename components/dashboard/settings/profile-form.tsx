"use client";

import { useState } from "react";
import { updateProfile } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, User, Link as LinkIcon, MapPin, Phone } from "lucide-react";

export function ProfileForm({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    try {
      await updateProfile(formData);
      setMessage("Profile updated successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setMessage("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={onSubmit} className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <User className="h-4 w-4" /> Personal Names
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input id="first_name" name="first_name" defaultValue={profile?.first_name || ""} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input id="last_name" name="last_name" defaultValue={profile?.last_name || ""} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="middle_name">Middle Name (Optional)</Label>
            <Input id="middle_name" name="middle_name" defaultValue={profile?.middle_name || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferred_name">Preferred Name (Optional)</Label>
            <Input id="preferred_name" name="preferred_name" defaultValue={profile?.preferred_name || ""} />
          </div>
        </div>
      </div>

      <hr className="border-muted" />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Phone className="h-4 w-4" /> Contact & Location
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input id="phone_number" name="phone_number" defaultValue={profile?.phone_number || ""} placeholder="+1 (555) 000-0000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">City, State / Region</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="location" name="location" defaultValue={profile?.location || ""} className="pl-9" placeholder="San Francisco, CA" />
            </div>
          </div>
        </div>
      </div>

      <hr className="border-muted" />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <LinkIcon className="h-4 w-4" /> Professional Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input id="linkedin_url" name="linkedin_url" defaultValue={profile?.linkedin_url || ""} placeholder="linkedin.com/in/..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input id="github_url" name="github_url" defaultValue={profile?.github_url || ""} placeholder="github.com/..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="portfolio_url">Portfolio URL</Label>
            <Input id="portfolio_url" name="portfolio_url" defaultValue={profile?.portfolio_url || ""} placeholder="yourwebsite.com" />
          </div>
        </div>
      </div>

      <hr className="border-muted" />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Professional Summary
        </h3>
        <div className="space-y-2">
          <Label htmlFor="professional_summary" className="text-muted-foreground font-normal">
            A short paragraph summarizing your career. The AI will use this as context when writing Cover Letters.
          </Label>
          <Textarea 
            id="professional_summary" 
            name="professional_summary" 
            defaultValue={profile?.professional_summary || ""} 
            rows={4} 
            placeholder="I am a software engineer with 5 years of experience building..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Profile Information
        </Button>
        {message && (
          <p className="text-sm text-emerald-600 font-medium animate-in fade-in">{message}</p>
        )}
      </div>
    </form>
  );
}