// import { SignUpForm } from "@/components/sign-up-form";

// export default function Page() {
//   return (
//     <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
//       <div className="w-full max-w-sm">
//         <SignUpForm />
//       </div>
//     </div>
//   );
// }

// import { SignUpForm } from "@/components/sign-up-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm text-center space-y-6">

        {/* <SignUpForm /> */}

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Private Beta</h1>
          <p className="text-muted-foreground text-sm">
            Sign-ups are currently closed while we build out the core features. We are not accepting new users at this time.
          </p>
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link href="/auth/login">Back to Sign In</Link>
        </Button>

      </div>
    </div>
  );
}