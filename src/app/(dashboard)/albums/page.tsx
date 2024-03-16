import { CreateAlbumForm } from "@/components/albums/create-album-form";
import PageHeader from "@/components/page-header";

import { getCurrentUser } from "@/lib/user";
import { Session } from "next-auth";

export default async function AlbumsPage() {
  const user = (await getCurrentUser()) as Session["user"];

  const familyMembers = await db.familyMember.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container">
      <PageHeader
        title="Albums"
        description="Create snapshots of your family for future generations."
      />

      <section className="mt-6">
        <CreateAlbumForm familyMembers={familyMembers} />
      </section>
    </div>
  );
}
