"use client";
import { Memory } from "@prisma/client";
import { Calendar, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFormattedDate } from "@/lib/utils";
import { DeleteModal } from "@/components/DeleteModal";
import { useDeleteMemory } from "@/hooks/memories";
import Image from "next/image";
import { toast } from '@/components/ui/use-toast';
import { startTransition } from "react";
import { useRouter } from 'next/navigation';
import { handleReactQueryError } from '@/lib/error';

type MemoriesGridProps = {
    memories: Memory[];
};

export default function MemoriesGrid({ memories }: MemoriesGridProps) {

    const { mutateAsync: deleteMemory } = useDeleteMemory();
    const router = useRouter();

    const handleMemoryDeletion = (id: string) => {
        return async () => {
            await deleteMemory(id, {
                onSuccess: () => {
                    toast({
                        variant: 'success',
                        title: 'Memory Deleted',
                        description: "The memory was deleted successfuly"
                    });
                    startTransition(() => {
                        router.refresh()
                    });
                },
                onError: handleReactQueryError
            });
        }
    }

    return (
        <div className="grid grid-cols-4 gap-8">
            {memories.map((memory) => (
                <div key={memory.id} className="rounded w-full mb-4 relative">
                    <div className="p-4 absolute transition-all cursor-pointer hover:bg-slate-900 text-white opacity-0 hover:opacity-75 w-full h-full bg-red flex flex-col items-center justify-center gap-2">
                        <h2 className="line-clamp-4 text-lg font-semibold">
                            {memory.description}
                        </h2>
                        <div className="flex gap-2">
                            {" "}
                            <Calendar /> <span>{getFormattedDate(memory.date)}</span>{" "}
                        </div>
                        <div className="flex">
                            <DeleteModal
                                title="Are you sure?"
                                description="This action cannot be undone. This will permanently delete your
                                memory and remove it from our servers."
                                onConfirm={handleMemoryDeletion(memory.id)}
                            />
                        </div>
                    </div>
                    <Image
                        className="rounded object-cover w-full h-[300px]"
                        src={memory.fileUrl ?? "https://placehold.co/150x150"}
                        alt={memory.description ?? ""}
                        height={300}
                        width={300}
                    />
                </div>
            ))}
        </div>
    );
}

