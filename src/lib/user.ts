import { getServerSession } from "next-auth";

/**
 * Get the current user
 * Only available in Server Components and API rotues (/app)
 */
export async function getCurrentUser() {
  const session = await getServerSession();
  if (!session || !session.user.email) return null;

  const userDb = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!userDb) return null;

  return {
    ...session.user,
    id: userDb?.id,
  };
}
