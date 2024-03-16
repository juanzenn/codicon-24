'use client'
import React from "react";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FamilyMember } from "@prisma/client";
import MemoryForm from "./MemoryForm";

type MemberDialogProps = {
    familyMembers: FamilyMember[];
}

export default function MemoryDialog({ familyMembers }: MemberDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Upload Memory</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[750px] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Memory</DialogTitle>
                    <DialogDescription>
                        Tag your loved ones and add a description of the memory you're uploading
                    </DialogDescription>
                </DialogHeader>
                <MemoryForm familyMembers={familyMembers} />
            </DialogContent>
        </Dialog>
    )
}
