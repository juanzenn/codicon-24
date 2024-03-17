import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/user";
import { FamilyMember } from "@prisma/client";
import Image from "next/image";
import MemoriesGrid from "./MemoriesGrid";
import MemoryDialog from "./MemoryDialog";

export default async function MemoriesPage() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const familyMembers = await db.familyMember.findMany({
    where: {
      ownerId: user.id,
    },
  });

  const memories = await db.memory.findMany({
    where: {
      ownerId: user.id,
    },
  });

  if (memories.length == 0) {
    return <EmptyState familyMembers={familyMembers} />;
  }

  return (
    <div className="container">
      <header className="mt-10">
        <h1 className="font-bold text-4xl mb-2">Memories</h1>
        <p>Add memories of the people you care about.</p>
      </header>
      <section className="my-6">
        <MemoryDialog familyMembers={familyMembers}>
          <Button>Upload Memory</Button>
        </MemoryDialog>
      </section>
      <MemoriesGrid memories={memories} />
    </div>
  );
}

type EmptyStateProps = {
  familyMembers: FamilyMember[];
};

function EmptyState({ familyMembers }: EmptyStateProps) {
  return (
    <div className="w-1/2 mx-auto grid grid-cols-2 justify-center items-center mt-12">
      <Image src={"/panda.png"} alt="Default Panda" width={300} height={300} />
      <div>
        <header className="mt-10">
          <h1 className="font-bold text-4xl mb-2">
            Hmmm, it seems that you don't have any memories at the moment...
          </h1>
          <p className="mb-4">Start by creating your first memory!</p>
          <MemoryDialog familyMembers={familyMembers}>
            <Button>Upload Memory</Button>
          </MemoryDialog>
        </header>
      </div>
    </div>
  );
}
