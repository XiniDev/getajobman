import { Hero } from "@/components/main/hero";
import { Features } from "@/components/main/features";

export default function Home() {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center pt-20 pb-10 px-4">
      <Hero />
      <Features />
    </div>
  );
}
