import { AddMember } from "@/components/members/add-member";
import { getCurrentUser } from "@/lib/user";

export default async function MembersPage() {
  const user = await getCurrentUser();

  return (
    <>
      {JSON.stringify(user, null, 2)}

      <header className="mt-10">
        <h1 className="font-bold text-4xl mb-2">Family Members</h1>
        <p>Add the people you care about.</p>
      </header>

      <section className="mt-6">
        <AddMember />
      </section>
    </>
  );
}
