"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FamilyMember } from "@prisma/client";
import React from "react";
import MemoryForm from "./MemoryForm";

type MemberDialogProps = {
  familyMembers: FamilyMember[];
  children: React.ReactNode;
};

export default function MemoryDialog({
  familyMembers,
  children,
}: MemberDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[750px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Memory</DialogTitle>
          <DialogDescription>
            Tag your loved ones and add a description of the memory you're
            uploading
          </DialogDescription>
        </DialogHeader>
        <MemoryForm familyMembers={familyMembers} setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}
