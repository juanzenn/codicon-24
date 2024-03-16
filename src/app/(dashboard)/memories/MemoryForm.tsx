'use client'
import React from 'react'
import { FamilyMember } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Trash } from 'lucide-react';
import { DatePicker } from '@/components/ui/datepicker';
import { DialogFooter } from '@/components/ui/dialog';
import { MultipleSelect } from '@/components/ui/multiple-select';
import { memoryFormSchema, type MemoryForm } from '@/app/validation/memories';
import { useCreateMemory } from '@/hooks/memories';
import { useUploadImage } from '@/hooks/useUploadImage';
import { handleReactQueryError, handleZodError } from '@/lib/error';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

const FORM_IDS = {
    MEMORY: "memory",
    DESCRIPTION: "description",
    FAMILY_MEMBERS: "family_members",
    DATE: "date",
};

type MemoryFormProps = {
    familyMembers: FamilyMember[]
}

export default function MemoryForm({ familyMembers }: MemoryFormProps) {
    const { uploadImage, isUploading } = useUploadImage();
    const { mutate: createMemory, isPending } = useCreateMemory();
    const router = useRouter();

    const [isPendingTransition, startTransition] = React.useTransition();

    const [form, setForm] = React.useState<MemoryForm>({
        memory: null,
        description: "",
        date: new Date(),
        familyMembers: [],
    });

    const isLoading = isUploading || isPending || isPendingTransition;

    const [preview, setPreview] = React.useState<string | ArrayBuffer | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleImagePrevisualization = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setForm((prevForm) => ({
                    ...prevForm,
                    memory: files[0]
                }))
            };
            reader.readAsDataURL(files[0]);
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm((prevForm) => ({
            ...prevForm,
            [e.target.name]: e.target.value
        }))
    }

    function handleClearImage() {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    function handleChangeDate(date?: Date) {
        setForm((prevForm) => ({
            ...prevForm,
            date: date ?? new Date(),
        }));
    }

    function handleToggleFamilyMember(memberId: string) {
        if (form.familyMembers.includes(memberId)) {
            setForm((prevForm) => ({
                ...prevForm,
                familyMembers: prevForm.familyMembers.filter((id) => id !== memberId),
            }));
            return;
        }

        setForm((prevForm) => ({
            ...prevForm,
            familyMembers: [...prevForm.familyMembers, memberId],
        }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!form.memory) {
            return;
        }

        const file_url = await uploadImage(form.memory);

        const memoryBody = {
            file_url,
            date: form.date,
            description: form.description,
            familyMembers: form.familyMembers
        }

        const validatedBody = memoryFormSchema.safeParse(memoryBody);

        if (!validatedBody.success) {
            handleZodError(validatedBody.error);
            return;
        }

        createMemory(validatedBody.data, {
            onSuccess: () => {
                toast({
                    variant: 'success',
                    title: 'Memory Added',
                    description: "The memory was added successfuly"
                });
                startTransition(() => {
                    router.refresh()
                });
            },
            onError: handleReactQueryError
        })


    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            {preview && (<div className="flex justify-center">
                <img src={preview as string} className="w-[250px] h-auto" alt="File preview" />
            </div>)}

            <div className="grid grid-cols-3 items-end gap-2">
                <div className="col-span-2">
                    <Label htmlFor={FORM_IDS.MEMORY}>Image</Label>
                    <Input
                        id={FORM_IDS.MEMORY}
                        name={FORM_IDS.MEMORY}
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImagePrevisualization}
                    />
                </div>
                <div>
                    <Button disabled={(preview == null) || isLoading} type="button" onClick={handleClearImage} className="w-full"><Trash className="mr-2" /> Clear Image</Button>
                </div>
            </div>

            <div className="space-y-1">
                <Label htmlFor={FORM_IDS.DESCRIPTION}>Description</Label>
                <Input
                    id={FORM_IDS.DESCRIPTION}
                    name={FORM_IDS.DESCRIPTION}
                    type="text"
                    onChange={handleChange}
                />
            </div>

            <div className="space-y-1">
                <Label htmlFor={FORM_IDS.FAMILY_MEMBERS}>Family members</Label>
                <MultipleSelect
                    onSelect={handleToggleFamilyMember}
                    values={form.familyMembers}
                    options={familyMembers.map(({ id, name, relationship }) => ({
                        value: id,
                        label: name,
                    }))}
                />
            </div>

            <div className="space-y-1">
                <Label htmlFor={FORM_IDS.DATE}>Date</Label>
                <DatePicker
                    id={FORM_IDS.DATE}
                    date={form.date}
                    onChange={handleChangeDate}
                    endDateNow
                />
            </div>

            <DialogFooter>
                <Button disabled={isLoading} type="submit">
                    {isLoading ? (<Loader2 className="animate-spin mr-2" />) : (<span>
                        Create Memory
                    </span>)}
                </Button>
            </DialogFooter>
        </form>
    )
}
