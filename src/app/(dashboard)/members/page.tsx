import { AddMember } from "@/components/members/add-member";
import MembersTable from "@/components/members/members-table";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/user";
import { Session } from "next-auth";

export default async function MembersPage() {
  const user = (await getCurrentUser()) as Session["user"];

  const members = await db.familyMember.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container">
      <PageHeader
        title="Family Members"
        description="Add the people you care about."
      />

      <section className="mt-6">
        <AddMember>
          <Button>Add Family Member</Button>
        </AddMember>
      </section>

      <section className="mt-6">
        <MembersTable members={members} />
      </section>
    </div>
  );
}
