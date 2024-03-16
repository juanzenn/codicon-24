import { AddMember } from "@/components/members/add-member";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { Session } from "next-auth";

export default async function MembersPage() {
  const user = (await getCurrentUser()) as Session["user"];

  const members = await db.familyMember.findMany({
    where: { ownerId: user.id },
  });

  return (
    <>
      <header className="mt-10">
        <h1 className="font-bold text-4xl mb-2">Family Members</h1>
        <p>Add the people you care about.</p>
      </header>

      <section className="mt-6">
        <AddMember />
      </section>

      <section>
        {members.map((member) => (
          <div key={member.id}>
            {member.name} - {member.relationship}
          </div>
        ))}
      </section>
    </>
  );
}
