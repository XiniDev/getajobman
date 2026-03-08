import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Target, FileSignature, Zap, LineChart } from "lucide-react";

export function Features() {
  const featureList = [
    {
      icon: Target,
      title: "AI Job Matchmaker",
      description: "Scrapes thousands of listings daily. We filter out the junk and present only the roles that match your exact skills, salary, and vibe.",
    },
    {
      icon: FileSignature,
      title: "Smart Cover Letters",
      description: "Generates highly personalized cover letters using your master CV, instantly tailored to the specific company you are applying for.",
    },
    {
      icon: Zap,
      title: "1-Click Auto-Fill",
      description: "Bypass soul-crushing ATS portals like Workday and Greenhouse. The system injects your data directly into the browser fields.",
    },
    {
      icon: LineChart,
      title: "Inbox Tracking",
      description: "Automatically reads incoming emails to track rejections and interview requests, updating your personal stats in real-time.",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mt-32 w-full">
      {featureList.map((feature, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow border-muted/50">
          <CardHeader>
            <div className="mb-2 w-fit rounded-lg bg-primary/10 p-3">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base leading-relaxed">
              {feature.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}