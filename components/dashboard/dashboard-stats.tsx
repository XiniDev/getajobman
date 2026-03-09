"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Target, TrendingDown } from "lucide-react";
import { Job } from "@/lib/types";

export function DashboardStats({ jobs }: { jobs: Job[] | null }) {
  const totalJobs = jobs?.length || 0;

  const interviews = jobs?.filter(job => job.status === "interviewing").length || 0;

  const rejections = jobs?.filter(job => job.status === "rejected").length || 0;

  const conversionRate = totalJobs > 0 
    ? Math.round((interviews / totalJobs) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tracked</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalJobs}</div>
          <p className="text-xs text-muted-foreground">In your pipeline</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Interviews Secured</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{interviews}</div>
          <p className="text-xs text-muted-foreground">
            Conversion rate: {conversionRate}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rejections</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rejections}</div>
          <p className="text-xs text-muted-foreground">Dodged bullets</p>
        </CardContent>
      </Card>
    </div>
  );
}
