'use client'
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FAMILY_MEMBER_RELATIONSHIPS } from "@/constants/relationships";
import { FamilyMember } from "@prisma/client";
import { Trash } from "lucide-react";
import React from "react";

type MemberDialogProps = {
    familyMembers: FamilyMember[];
}

export default function MemoryDialog({ familyMembers }: MemberDialogProps) {
    const [preview, setPreview] = React.useState<string | ArrayBuffer | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleImagePrevisualization = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(files[0]);
        }
    }

    const handleClearImage = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Upload Memory</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Memory</DialogTitle>
                    <DialogDescription>
                        Tag your loved ones and add a description of the memory you're uploading
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-6">

                    {preview && (<div className="flex justify-center">
                        <img src={preview as string} className="w-[250px] h-auto" alt="File preview" />
                    </div>)}

                    <div className="grid grid-cols-3 items-center gap-2">
                        <div className="col-span-2">
                            <Input
                                id="memory"
                                name="memory"
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImagePrevisualization}
                            />
                        </div>
                        <div>
                            <Button type="button" onClick={handleClearImage} className="w-full"><Trash className="mr-2" /> Clear Image</Button>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="relationship">Members</Label>
                        <Select
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Father, Mother..." />
                            </SelectTrigger>
                            <SelectContent>
                                {familyMembers.map(({ id, name }) => (
                                    <SelectItem key={id} value={id}>
                                        {name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
