import { Memory } from "@prisma/client";
import MemoryDialog from "./MemoryDialog";
import { getCurrentUser } from "@/lib/user";

const MOCK_MEMORIES = [
    {
        id: '1',
        title: "",
        date: new Date(),
        description: 'a',
        fileUrl: '',
        isArchived: false,
        ownerId: "1",
    },
    {
        id: '1',
        title: "",
        date: new Date(),
        description: 'b',
        fileUrl: '',
        isArchived: false,
        ownerId: "1",
    },
    {
        id: '1',
        title: "",
        date: new Date(),
        description: 'c',
        fileUrl: '',
        isArchived: false,
        ownerId: "1",
    },
    {
        id: '1',
        title: "",
        date: new Date(),
        description: 'd',
        fileUrl: '',
        isArchived: false,
        ownerId: "1",
    },
] satisfies Memory[];

export default async function MemoriesPage() {

    const user = await getCurrentUser();
    if (!user) {
        return null;
    }

    const familyMembers = await db.familyMember.findMany({
        where: {
            ownerId: user.id
        }
    })

    return (
        <div>
            <header className="mt-10">
                <h1 className="font-bold text-4xl mb-2">Memories</h1>
                <p>Add memories of the people you care about.</p>
            </header>
            <section className="my-6">
                <MemoryDialog familyMembers={familyMembers} />
            </section>
            <div className="grid grid-cols-4">
                {MOCK_MEMORIES.map(memory => (
                    <div key={memory.id}>
                        {memory.description}
                    </div>
                ))}
            </div>
        </div>
    );
}
