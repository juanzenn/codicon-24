'use client'
import React from 'react'
import { FamilyMember } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash } from 'lucide-react';
import { DatePicker } from '@/components/ui/datepicker';
import { DialogFooter } from '@/components/ui/dialog';

type MemoryForm = {
    title: string;
    description: string;
    date: Date;
    familyMembers: FamilyMember[]
}

const FORM_IDS = {
    TITLE: "title",
    DESCRIPTION: "description",
    FAMILY_MEMBERS: "family-members",
    DATE: "date",
};

export default function MemoryForm() {
    const [form, setForm] = React.useState<MemoryForm>({
        title: "",
        description: "",
        date: new Date(),
        familyMembers: [],
    });
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


    function handleChangeDate(date?: Date) {
        setForm((prevForm) => ({
            ...prevForm,
            date: date ?? new Date(),
        }));
    }

    const handleClearImage = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <form className="space-y-6">

            {preview && (<div className="flex justify-center">
                <img src={preview as string} className="w-[250px] h-auto" alt="File preview" />
            </div>)}

            <div className="grid grid-cols-3 items-end gap-2">
                <div className="col-span-2">
                    <Label htmlFor={FORM_IDS.DATE}>Image</Label>
                    <Input
                        id="memory"
                        name="memory"
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImagePrevisualization}
                    />
                </div>
                <div>
                    <Button disabled={preview == null} type="button" onClick={handleClearImage} className="w-full"><Trash className="mr-2" /> Clear Image</Button>
                </div>
            </div>

            <div className="space-y-1">
                <Label htmlFor={FORM_IDS.DATE}>Description</Label>
                <Input
                    id="memory"
                    name="memory"
                    type="text"
                />
            </div>

            <div className="space-y-1">
                <Label htmlFor={FORM_IDS.DATE}>Date</Label>
                <DatePicker
                    id={FORM_IDS.DATE}
                    date={form.date}
                    onChange={handleChangeDate}
                />
            </div>

            <DialogFooter>
                <Button type="submit">Create</Button>
            </DialogFooter>
        </form>
    )
}
