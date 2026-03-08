import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasEnvVars = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? true : false;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar hasEnvVars={hasEnvVars} />
      <main className="flex-1 w-full flex flex-col items-center">
        {children}
      </main>
      <Footer />
    </div>
  );
}
