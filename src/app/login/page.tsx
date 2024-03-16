import DiscordLogin from "@/components/discord-login";
import { getCurrentUser } from "@/lib/user";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/albums");
  }

  return (
    <div className="flex justify-center items-center">
      <section className="bg-card text-card-foreground p-6 rounded shadow w-[580px]">
        <h1 className="text-4xl font-bold tracking-tight text-center mb-2">
          Login
        </h1>
        <DiscordLogin />
      </section>
    </div>
  );
}
