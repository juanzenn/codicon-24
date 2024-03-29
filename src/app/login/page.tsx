import DiscordLogin from "@/components/discord-login";
import { getCurrentUser } from "@/lib/user";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex justify-center items-center h-dvh">
      <section className="relative bg-card text-card-foreground py-12 px-8 rounded-2xl shadow-md w-[600px] text-center leading-relaxed">
        <img
          src="/rosa.png"
          alt="Rosa"
          className="absolute right-[-15%] bottom-[-15%] rotate-12 w-[200px]"
        />

        <img
          src="/juan.png"
          alt="Juan"
          className="absolute left-[-20%] bottom-[-10%] w-[200px] rotate-2"
        />

        <h1 className="text-4xl font-bold tracking-tight text-center text-primary mb-5">
          Heritage Keeper
        </h1>
        <p className="mb-2">
          Heritage Keeper is a platform for <strong>transmitting</strong> your
          family history.
        </p>
        <p className="mb-8">
          It is designed to be easy to use and to help you preserve your
          family's history for future generations.
        </p>

        <DiscordLogin />
      </section>
    </div>
  );
}
