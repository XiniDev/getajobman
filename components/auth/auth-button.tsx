import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export async function AuthButton() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground hidden sm:inline-block">
        Hey, {user.email}!
      </span>
      <Button asChild size="sm" variant="default">
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="default">
        <Link href="/auth/login">Sign in</Link>
      </Button>
      {/* disabled until further notice */}
      {/* <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button> */}
    </div>
  );
}