import { MemoryWithFamilyMembersNames } from "@/lib/types";
import { getFormattedDate } from "@/lib/utils";
import { Calendar, User, User2 } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type Props = {
  memory: MemoryWithFamilyMembersNames;
  children: React.ReactNode;
};

export default function ViewMemory({ memory, children }: Props) {
  if (!memory.fileUrl) {
    return null;
  }

  const hasVariousFamilyMembers = memory.familyMembers.length > 1;

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className=" flex flex-col max-w-[75vw] p-4">
        <DialogHeader id="main">
          <div className="flex items-center gap-8">
            <div className="flex flex-1 flex-col justify-center">
              <DialogTitle className="text-xl">View Memory</DialogTitle>
              <DialogDescription className="text-lg mb-2 line-clamp-2">
                {memory.description}
              </DialogDescription>
              <div className="flex gap-4">
                <DialogDescription className="text-sm text-muted-foreground flex gap-2 mb-2">
                  <Calendar size={16} className="flex-shrink-0" />
                  {getFormattedDate(memory.date)}
                </DialogDescription>
                <DialogDescription className="text-sm text-muted-foreground flex gap-2">
                  {hasVariousFamilyMembers ? (
                    <User2 size={16} className="flex-shrink-0" />
                  ) : (
                    <User size={16} className="flex-shrink-0" />
                  )}
                  {memory.familyMembers.map((member) => member.name).join(", ")}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <figure className="flex-1">
          <img
            src={memory.fileUrl}
            alt={memory.description ?? ""}
            className="max-h-[80vh] mx-auto rounded-md shadow-md"
          />
        </figure>

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
