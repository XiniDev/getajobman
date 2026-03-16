"use client";

import { useState, useRef } from "react";
import { uploadAndParseCV } from "@/lib/actions/cv";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Sparkles, Loader2, CheckCircle2 } from "lucide-react";

export function CVUploader() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadAndParseCV(formData);

    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000); 
    } else {
      alert(result.error || "Something went wrong.");
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Card className="border-primary/50 bg-primary/5 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Resume Import
        </CardTitle>
        <CardDescription>
          Upload your existing PDF resume. Our AI will automatically extract your experience, education, and skills into the database blocks below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <input 
          type="file" 
          accept="application/pdf" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <div 
          onClick={() => !loading && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-primary/20 rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors ${
            loading ? "bg-muted cursor-not-allowed opacity-70" : "bg-background/50 hover:bg-background/80 cursor-pointer"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
              <h3 className="font-semibold text-lg">AI is reading your resume...</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                This usually takes about 10-15 seconds.
              </p>
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-4" />
              <h3 className="font-semibold text-lg text-emerald-600">Import Complete!</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Your database has been updated.
              </p>
              <Button variant="outline" onClick={(e) => { e.stopPropagation(); setSuccess(false); }}>Upload Another</Button>
            </>
          ) : (
            <>
              <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg">Click to upload PDF</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Max file size 5MB.
              </p>
              <Button type="button" variant="secondary">Select File</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
