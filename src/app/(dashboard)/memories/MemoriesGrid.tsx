"use client";
import { DeleteModal } from "@/components/DeleteModal";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import ViewMemory from "@/components/view-memory";
import { useDeleteMemory } from "@/hooks/memories";
import { handleReactQueryError } from "@/lib/error";
import { MemoryWithFamilyMembersNames } from "@/lib/types";
import { getFormattedDate } from "@/lib/utils";
import { Calendar, Eye, FileDown, User, Users2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { saveAs } from "file-saver";

type MemoriesGridProps = {
  memories: MemoryWithFamilyMembersNames[];
};

export default function MemoriesGrid({ memories }: MemoriesGridProps) {
  const { mutateAsync: deleteMemory } = useDeleteMemory();
  const router = useRouter();

  const handleMemoryDeletion = (id: string) => {
    return async () => {
      await deleteMemory(id, {
        onSuccess: () => {
          toast({
            variant: "success",
            title: "Memory Deleted",
            description: "The memory was deleted successfuly",
          });
          startTransition(() => {
            router.refresh();
          });
        },
        onError: handleReactQueryError,
      });
    };
  };

  async function handleDownloadMemory(memoryId: string, fileUrl: string) {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const extension = blob.type.split("/")[1];

    saveAs(blob, `${memoryId}.${extension}`);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {memories.map((memory) => (
        <div key={memory.id} className="relative rounded w-full mb-4 group">
          <div className="absolute px-4 text-center transition-all cursor-pointer text-white opacity-0 hover:opacity-75 w-full h-full bg-red flex flex-col items-center justify-center gap-2 z-20">
            <h2 className="line-clamp-4 text-lg font-semibold">
              {memory.description}
            </h2>
            <div className="flex gap-2">
              {" "}
              <Calendar /> <span>{getFormattedDate(memory.date)}</span>{" "}
            </div>
            <div className="flex gap-4">
              <ViewMemory memory={memory}>
                <Button variant="ghost">
                  <Eye size={16} className="flex-shrink-0" />
                </Button>
              </ViewMemory>

              <Button
                onClick={() =>
                  handleDownloadMemory(memory.id, memory.fileUrl ?? "")
                }
                variant="ghost"
              >
                <FileDown size={16} className="flex-shrink-0" />
              </Button>

              <DeleteModal
                title="Are you sure?"
                description="This action cannot be undone. This will permanently delete your
                                memory and remove it from our servers."
                onConfirm={handleMemoryDeletion(memory.id)}
              />
            </div>
          </div>
          <figure className="top-0 left-0 w-full h-[300px] group-hover:backdrop-blur-sm bg-black/80 group-hover:block hidden z-10 absolute transition-all rounded" />
          <figure className="relative h-[300px]">
            <Image
              className="rounded object-cover w-full h-[300px]"
              src={memory.fileUrl ?? "https://placehold.co/150x150"}
              alt={memory.description ?? ""}
              fill
            />
          </figure>

          <footer className="mt-3 flex items-start gap-2">
            {memory.familyMembers.length > 1 ? (
              <Users2 size={16} className="flex-shrink-0" />
            ) : (
              <User size={16} className="flex-shrink-0" />
            )}
            <span className="text-muted-foreground text-sm text-pretty">
              {memory.familyMembers.map((member) => member.name).join(", ")}
            </span>
          </footer>
        </div>
      ))}
    </div>
  );
}
