import { getCurrentUser } from "@/lib/user";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();
  const redirectUri = user ? "/albums" : "/login";

  redirect(redirectUri);
}
