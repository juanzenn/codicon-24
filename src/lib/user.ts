import { getServerSession } from "next-auth";

/**
 * Get the current user
 * Only available in Server Components and API rotues (/app)
 */
export async function getCurrentUser() {
  const session = await getServerSession();
  return session?.user;
}
