import { redirect } from "next/navigation";

import { ProfileEditor } from "@/components/profile-editor";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The middleware already guards this route; this is a belt-and-suspenders
  // check and gives us the user object for the greeting.
  if (!user) {
    redirect("/login?redirectTo=/dashboard");
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Signed in as <span className="font-medium">{user.email}</span>
      </p>

      <div className="mt-8">
        <ProfileEditor />
      </div>
    </main>
  );
}
