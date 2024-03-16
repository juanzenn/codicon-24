import { getCurrentUser } from "@/lib/user";
import MemoryDialog from "./MemoryDialog";
import Image from "next/image";
import { FamilyMember } from "@prisma/client";

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
      ownerId: user.id
    }
  })

  if (memories.length == 0) {
    return <EmptyState familyMembers={familyMembers} />
  }

  return (
    <div className="container">
      <header className="mt-10">
        <h1 className="font-bold text-4xl mb-2">Memories</h1>
        <p>Add memories of the people you care about.</p>
      </header>
      <section className="my-6">
        <MemoryDialog familyMembers={familyMembers} />
      </section>
      <div className="grid grid-cols-4 gap-8">
        {memories.map((memory) => (
          <div key={memory.id} className="w-full mb-4 relative">
            <div className="absolute transition-all cursor-pointer hover:bg-slate-900 opacity-75 w-full h-full bg-red">fdafdsfdafdsafdsa</div>
            <Image className="object-cover w-full h-[300px]" src={memory.fileUrl ?? "https://placehold.co/150x150"} alt={memory.description ?? ""} width={150} height={150} />
          </div>
        ))}
      </div>
    </div>
  );
}

type EmptyStateProps = {
  familyMembers: FamilyMember[]
}

function EmptyState({ familyMembers }: EmptyStateProps) {
  return (
    <div className="w-1/2 mx-auto grid grid-cols-2 justify-center items-center mt-12">
      <Image src={'/panda.png'} alt="Default Panda" width={300} height={300} />
      <div>
        <header className="mt-10">
          <h1 className="font-bold text-4xl mb-2">Hmmm, it seems that you don't have any memories at the moment...</h1>
          <p className="mb-4">Start by creating your first memory!</p>
          <MemoryDialog familyMembers={familyMembers} />
        </header>
      </div>
    </div>
  )
}