import { getCurrentUser } from "@/lib/user";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/albums");
  }

  return (
    <div>
      <h1>Login</h1>
      <p>
        <a href="/api/auth/signin">Sign in</a>
      </p>
    </div>
  );
}
