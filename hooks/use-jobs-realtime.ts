"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Job } from "@/lib/types";
import { useRouter } from "next/navigation";

export function useJobsRealtime(initialJobs: Job[] | null) {
  const [jobs, setJobs] = useState<Job[] | null>(initialJobs);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    setJobs(initialJobs);
  }, [initialJobs]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-jobs")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "jobs",
        },
        (payload) => {
          console.log("Realtime event received!", payload);

          if (payload.eventType === "INSERT") {
            setJobs((current) => [payload.new as Job, ...(current || [])]);
          } 
          else if (payload.eventType === "UPDATE") {
            setJobs((current) =>
              (current || []).map((job) =>
                job.id === payload.new.id ? (payload.new as Job) : job
              )
            );
          } 
          else if (payload.eventType === "DELETE") {
            setJobs((current) =>
              (current || []).filter((job) => job.id !== payload.old?.id)
            );
          }

          router.refresh(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return jobs;
}
