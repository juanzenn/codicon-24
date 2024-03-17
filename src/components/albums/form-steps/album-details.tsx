import { CreateAlbumForm, albumDetailsSchema } from "@/app/validation/albums";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { handleZodError } from "@/lib/error";

const FORM_IDS = {
  TITLE: "title",
  DESCRIPTION: "description",
  DATE: "date",
};

type AlbumDetailsFormStepProps = {
  album: CreateAlbumForm;
  setAlbum: React.Dispatch<React.SetStateAction<CreateAlbumForm>>;
  next: () => void;
};

export function AlbumDetailsFormStep({
  next,
  setAlbum,
  album,
}: AlbumDetailsFormStepProps) {
  function handleChangeInput(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setAlbum((prevForm) => ({
      ...prevForm,
      details: {
        ...prevForm.details,
        [name]: value,
      },
    }));
  }

  function handleChangeDate(date?: Date) {
    setAlbum((prevForm) => ({
      ...prevForm,
      details: {
        ...prevForm.details,
        date: date ?? new Date(),
      },
    }));
  }

  function handleSubmitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validatedBody = albumDetailsSchema.safeParse(album.details);

    if (!validatedBody.success) {
      handleZodError(validatedBody.error);
      return;
    }

    next();
  }

  return (
    <form onSubmit={handleSubmitForm} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor={FORM_IDS.TITLE}>Title</Label>
        <Input
          id={FORM_IDS.TITLE}
          name={FORM_IDS.TITLE}
          placeholder="Best family holidays ever"
          value={album.details.title}
          onChange={handleChangeInput}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor={FORM_IDS.TITLE}>Description</Label>
        <Textarea
          id={FORM_IDS.DESCRIPTION}
          name={FORM_IDS.DESCRIPTION}
          value={album.details.description}
          onChange={handleChangeInput}
          rows={5}
          className="resize-none"
          placeholder="This is a new album for our family holidays in 2021 🌴🌞."
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor={FORM_IDS.DATE}>Date</Label>
        <DatePicker
          id={FORM_IDS.DATE}
          date={album.details.date}
          onChange={handleChangeDate}
          endDateNow
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="w-48 items-center gap-4">
          Next
        </Button>
      </div>
    </form>
  );
}
