"use client";

import { AlbumForm, albumFormSchema } from "@/app/validation/albums";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FamilyMember } from "@prisma/client";
import React from "react";
import { MultipleSelect } from "../ui/multiple-select";
import { handleReactQueryError, handleZodError } from "@/lib/error";
import { useCreateAlbum } from "@/hooks/albums";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";

const FORM_IDS = {
  TITLE: "title",
  DESCRIPTION: "description",
  FAMILY_MEMBERS: "family-members",
  DATE: "date",
};

type AlbumFormProps = {
  familyMembers: FamilyMember[];
};

export function CreateAlbumForm({ familyMembers }: AlbumFormProps) {
  const router = useRouter();
  const { mutate: createAlbum, isPending: isCreatingAlbum } = useCreateAlbum();
  const [isPendingTransition, startTransition] = React.useTransition();
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [form, setForm] = React.useState<AlbumForm>({
    title: "",
    description: "",
    date: new Date(),
    familyMembers: [],
  });

  const isLoading = isCreatingAlbum || isPendingTransition;

  function handleChangeInput(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }

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

  function clearForm() {
    setForm({
      date: new Date(),
      title: "",
      description: "",
      familyMembers: [],
    });
  }

  async function handleCreateAlbum(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validatedBody = albumFormSchema.safeParse(form);

    if (!validatedBody.success) {
      handleZodError(validatedBody.error);
      return;
    }

    createAlbum(validatedBody.data, {
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Album Created",
          description: "The album has been created successfully.",
        });

        startTransition(() => {
          router.refresh();
        });

        setTimeout(() => {
          clearForm();
        }, 200);

        setIsOpenModal(false);
      },
      onError: handleReactQueryError,
    });
  }

  return (
    <Dialog
      open={isOpenModal}
      onOpenChange={() => setIsOpenModal(!isOpenModal)}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus size={24} className="mr-2" />
          <span>Create album</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new album</DialogTitle>
          <DialogDescription>
            <span>
              Take a snapshot of your favorite memories with your family and
              save it into an
            </span>
            <span className="text-primary font-bold"> album.</span>
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-3" onSubmit={handleCreateAlbum}>
          <div className="space-y-1">
            <Label htmlFor={FORM_IDS.TITLE}>Title</Label>
            <Input
              id={FORM_IDS.TITLE}
              name={FORM_IDS.TITLE}
              placeholder="Best family holidays ever"
              value={form.title}
              onChange={handleChangeInput}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor={FORM_IDS.TITLE}>Description</Label>
            <Textarea
              id={FORM_IDS.DESCRIPTION}
              name={FORM_IDS.DESCRIPTION}
              value={form.description}
              onChange={handleChangeInput}
              rows={5}
              className="resize-none"
              placeholder="This is a new album for our family holidays in 2021 🌴🌞."
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor={FORM_IDS.FAMILY_MEMBERS}>Family members</Label>
            <MultipleSelect
              onSelect={handleToggleFamilyMember}
              values={form.familyMembers}
              options={familyMembers.map(({ id, name }) => ({
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

          <div className="flex justify-end">
            <Button
              disabled={isLoading}
              type="submit"
              className="w-48 items-center gap-4"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
