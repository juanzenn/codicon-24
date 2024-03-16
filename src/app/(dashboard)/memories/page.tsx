import { Button } from "@/components/ui/button";
import { Memory } from "@prisma/client";
import MemoryDialog from "./MemoryDialog";

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

export default function MemoriesPage() {
    return (
        <div>
            <h1>Memories Page</h1>
            <MemoryDialog />
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
