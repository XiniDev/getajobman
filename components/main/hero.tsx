import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="max-w-4xl text-center space-y-8 mt-10 animate-in fade-in zoom-in duration-500">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter">
        Stop typing. <br />
        <span className="text-primary">Start interviewing.</span>
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Your personal AI job-hunting machine. It finds the roles, writes the letters, and fills the forms. You just show up and get hired.
      </p>
      
      <div className="flex gap-4 justify-center mt-8">
        <Button asChild size="lg" className="font-bold px-8">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="font-bold px-8">
          <Link href="/auth/login">Sign In</Link>
        </Button>
      </div>
    </section>
  );
}
