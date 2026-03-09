"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Inbox, Settings2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/jobs/job-card";
import { Job } from "@/lib/types";
import Link from "next/link";

export function DashboardJobQueue({ jobs }: { jobs: Job[] | null }) {
  const recentJobs = jobs?.slice(0, 5) || [];
  const hasMore = (jobs?.length || 0) > 5;

  return (
    <Card className="col-span-1 border-none shadow-none bg-transparent">
      <CardHeader className="px-0 flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Your latest pipeline updates.
          </p>
        </div>
        {(jobs?.length || 0) > 0 && (
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-primary">
            <Link href="/dashboard/queue">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="px-0 space-y-4">
        {recentJobs.length > 0 ? (
          <>
            {recentJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
            {hasMore && (
              <div className="text-center pt-2">
                <p className="text-xs text-muted-foreground">
                  + {jobs!.length - 5} more jobs in your queue
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center border border-dashed rounded-lg bg-muted/10">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-muted rounded-full">
                <Inbox className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">Your queue is empty.</p>
              <Button variant="outline" size="sm">
                <Settings2 className="mr-2 h-4 w-4" />
                Configure Filters
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
