import Link from "next/link";
import { Suspense } from "react";

import { AuthButton } from "@/components/auth-button"; 
import { EnvVarWarning } from "@/components/env-var-warning"; 
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Navbar({ hasEnvVars }: { hasEnvVars: boolean }) {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-background">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 text-sm">

        <div className="flex items-center font-extrabold text-xl tracking-tighter">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            Get A Job Man
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {!hasEnvVars ? (
            <EnvVarWarning />
          ) : (
            <Suspense fallback={<div className="text-sm text-muted-foreground">Loading...</div>}>
              <AuthButton />
            </Suspense>
          )}
          <ThemeSwitcher /> 
        </div>

      </div>
    </nav>
  );
}
