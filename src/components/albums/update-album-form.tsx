import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { AlbumForm, albumFormSchema } from "@/app/validation/albums";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { MultipleSelect } from "../ui/multiple-select";
import { FamilyMember } from "@prisma/client";
import { DatePicker } from "../ui/datepicker";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useUpdateAlbum } from "@/hooks/albums";
import { handleReactQueryError, handleZodError } from "@/lib/error";
import { toast } from "../ui/use-toast";

const FORM_IDS = {
  TITLE: "title",
  DESCRIPTION: "description",
  FAMILY_MEMBERS: "family-members",
  DATE: "date",
};

type UpdateAlbumFormProps = {
  children: React.ReactNode;
  album: AlbumForm & { id: string };
  familyMembers: FamilyMember[];
};

export function UpdateAlbumForm({
  children,
  album,
  familyMembers,
}: UpdateAlbumFormProps) {
  const DEFAULT_FORM_VALUES = {
    title: album.title,
    description: album.description,
    date: album.date,
    familyMembers: album.familyMembers,
  };

  const router = useRouter();
  const { mutate: updateAlbum, isPending: isUpdatingAlbum } = useUpdateAlbum();
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [isPendingTransition, startTransition] = useTransition();

  const [form, setForm] = React.useState<AlbumForm>(DEFAULT_FORM_VALUES);

  const isLoading = isUpdatingAlbum || isPendingTransition;

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

  function handleOpenChangeModal() {
    if (isOpenModal) {
      setTimeout(() => {
        setForm(DEFAULT_FORM_VALUES);
      }, 200);
      setIsOpenModal(false);
      return;
    }

    setIsOpenModal(true);
  }

  function handleUpdateAlbum(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validatedBody = albumFormSchema.safeParse(form);

    if (!validatedBody.success) {
      handleZodError(validatedBody.error);
      return;
    }

    updateAlbum(
      { ...validatedBody.data, id: album.id },
      {
        onSuccess: () => {
          toast({
            variant: "success",
            title: "Album updated",
            description: "The album has been updated successfully.",
          });

          startTransition(() => {
            router.refresh();
          });

          setTimeout(() => {
            setForm(DEFAULT_FORM_VALUES);
          }, 200);

          setIsOpenModal(false);
        },
        onError: handleReactQueryError,
      },
    );
  }

  return (
    <Dialog open={isOpenModal} onOpenChange={handleOpenChangeModal}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update your album</DialogTitle>
          <DialogDescription>
            <p>
              <span>If the</span>
              <span className="text-primary font-bold"> family members</span>
              <span>
                {" "}
                are updated, the memories will be recomputed and regenerated.
              </span>
            </p>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdateAlbum} className="space-y-3">
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
              {isLoading ? <Loader2 className="animate-spin" /> : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
