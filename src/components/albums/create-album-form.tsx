"use client";

import {
  CreateAlbumForm,
  albumDetailsSchema,
  createAlbumSchema,
  selectMemoriesSchema,
} from "@/app/validation/albums";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAlbum } from "@/hooks/albums";
import { handleReactQueryError, handleZodError } from "@/lib/error";
import { FamilyMember, Memory } from "@prisma/client";
import { Loader2, Check } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { MultipleSelect } from "../ui/multiple-select";
import { toast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";

const FORM_IDS = {
  TITLE: "title",
  DESCRIPTION: "description",
  FAMILY_MEMBERS: "family-members",
  DATE: "date",
};

type AlbumDetailsFormStepProps = {
  album: CreateAlbumForm;
  setAlbum: React.Dispatch<React.SetStateAction<CreateAlbumForm>>;
  next: () => void;
};

function AlbumDetailsFormStep({
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

type MemoriesSelectorStepProps = {
  album: CreateAlbumForm;
  setAlbum: React.Dispatch<React.SetStateAction<CreateAlbumForm>>;
  handleCreateAlbum: (event: React.FormEvent<HTMLFormElement>) => void;
  availableMemories: Memory[];
  familyMembers: FamilyMember[];
  isLoading: boolean;
  back: () => void;
};

function MemoriesSelectorStep({
  back,
  album,
  setAlbum,
  isLoading,
  availableMemories,
  familyMembers,
  handleCreateAlbum,
}: MemoriesSelectorStepProps) {
  const router = useRouter();
  const queryParams = useParams<{ familyMembers: string }>();

  const familyMembersAsOptions = familyMembers.map((member) => ({
    value: member.id,
    label: member.name,
  }));

  function handleToggleFamilyMember(memberId: string) {
    if (album.selectedMemories.familyMembers.includes(memberId)) {
      setAlbum((prevForm) => ({
        ...prevForm,
        selectedMemories: {
          ...prevForm.selectedMemories,
          familyMembers: prevForm.selectedMemories.familyMembers.filter(
            (id) => id !== memberId,
          ),
        },
      }));
      return;
    }

    setAlbum((prevForm) => ({
      ...prevForm,
      selectedMemories: {
        ...prevForm.selectedMemories,
        familyMembers: [...prevForm.selectedMemories.familyMembers, memberId],
      },
    }));
  }

  function handleToggleMemory(memoryId: string) {
    if (album.selectedMemories.memories.includes(memoryId)) {
      setAlbum((prevForm) => ({
        ...prevForm,
        selectedMemories: {
          ...prevForm.selectedMemories,
          memories: prevForm.selectedMemories.memories.filter(
            (id) => id !== memoryId,
          ),
        },
      }));
      return;
    }

    setAlbum((prevForm) => ({
      ...prevForm,
      selectedMemories: {
        ...prevForm.selectedMemories,
        memories: [...prevForm.selectedMemories.memories, memoryId],
      },
    }));
  }

  async function handleSubmitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validatedBody = selectMemoriesSchema.safeParse(
      album.selectedMemories,
    );

    if (!validatedBody.success) {
      handleZodError(validatedBody.error);
      return;
    }

    handleCreateAlbum(event);
  }

  useEffect(() => {
    const params = new URLSearchParams();

    params.set("familyMembers", album.selectedMemories.familyMembers.join(","));
    router.push(`/albums?${params.toString()}`);
  }, [album.selectedMemories.familyMembers]);

  return (
    <section>
      <form onSubmit={handleSubmitForm} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor={FORM_IDS.FAMILY_MEMBERS}>Family Members</Label>
          <MultipleSelect
            values={album.selectedMemories.familyMembers}
            options={familyMembersAsOptions}
            onSelect={handleToggleFamilyMember}
          />
        </div>

        <div className="grid grid-cols-4 gap-8 space-y-1">
          {availableMemories.map((memory) => (
            <div
              onClick={() => handleToggleMemory(memory.id)}
              className="relative"
            >
              <Image
                key={memory.id}
                className="rounded object-cover w-full h-[180px]"
                src={memory.fileUrl ?? "https://placehold.co/150x150"}
                alt={memory.description ?? ""}
                height={180}
                width={180}
              />

              <div
                className={cn(
                  "absolute hidden w-full h-full top-0 left-0 bg-black/5 backdrop-blur-[1px] transition-all",
                  album.selectedMemories.memories.includes(memory.id) &&
                    "flex justify-center items-center",
                )}
              >
                <Check size={48} />
              </div>
            </div>
          ))}
        </div>

        <footer className="flex gap-6">
          <Button onClick={back} className="w-full" variant="default">
            Back
          </Button>

          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              "Create Album"
            )}
          </Button>
        </footer>
      </form>
    </section>
  );
}

const CREATE_ALBUM_STEPS = [
  {
    id: "ALBUM_DETAILS",
    title: "Album Details",
    description: "Fill in the details of your album.",
    Component: AlbumDetailsFormStep,
  },
  {
    id: "SELECT_MEMORIES",
    title: "Select Memories",
    description: "Choose the memories you want to include in your album.",
    Component: MemoriesSelectorStep,
  },
] as const;

type AlbumFormProps = {
  memories: Memory[];
  familyMembers: FamilyMember[];
};

export function CreateAlbumForm({ familyMembers, memories }: AlbumFormProps) {
  const router = useRouter();

  const [activeStep, setActiveStep] = React.useState(0);
  const currentStep = CREATE_ALBUM_STEPS[activeStep];

  const { mutate: createAlbum, isPending: isCreatingAlbum } = useCreateAlbum();
  const [isPendingTransition, startTransition] = React.useTransition();
  const [isOpenModal, setIsOpenModal] = React.useState(false);

  const [album, setAlbum] = React.useState<CreateAlbumForm>({
    details: {
      date: new Date(),
      description: "",
      title: "",
    },
    selectedMemories: {
      familyMembers: [],
      memories: [],
    },
  });

  const isLoading = isCreatingAlbum || isPendingTransition;

  async function handleCreateAlbum(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validatedBody = createAlbumSchema.safeParse(album);

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
          setAlbum({
            details: {
              date: new Date(),
              description: "",
              title: "",
            },
            selectedMemories: {
              familyMembers: [],
              memories: [],
            },
          });
        }, 200);

        setIsOpenModal(false);
      },
      onError: handleReactQueryError,
    });
  }

  const handleOpenModalChange = () => {
    if (isOpenModal) {
      setAlbum({
        details: {
          date: new Date(),
          description: "",
          title: "",
        },
        selectedMemories: {
          familyMembers: [],
          memories: [],
        },
      });
    }

    setActiveStep(0);
    setIsOpenModal(!isOpenModal);
  };

  return (
    <Dialog open={isOpenModal} onOpenChange={handleOpenModalChange}>
      <DialogTrigger asChild>
        <Button>
          <span>Create album</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new album</DialogTitle>
          <DialogDescription>{currentStep.description}</DialogDescription>
        </DialogHeader>

        <section className="flex gap-4">
          <div className="w-full">
            <h2 className="text-center font-medium">Details</h2>
            <div className={cn("h-2 w-full bg-primary rounded-sm")} />
          </div>

          <div className="w-full">
            <h2 className="text-center font-medium">Memories</h2>
            <div
              className={cn(
                "h-2 w-full bg-gray-300 rounded-sm",
                activeStep === 1 && "bg-primary",
              )}
            />
          </div>
        </section>

        {currentStep.id === "ALBUM_DETAILS" && (
          <currentStep.Component
            album={album}
            setAlbum={setAlbum}
            next={() => setActiveStep((prev) => prev + 1)}
          />
        )}

        {currentStep.id === "SELECT_MEMORIES" && (
          <currentStep.Component
            album={album}
            setAlbum={setAlbum}
            handleCreateAlbum={handleCreateAlbum}
            isLoading={isLoading}
            availableMemories={memories}
            familyMembers={familyMembers}
            back={() => setActiveStep((prev) => prev - 1)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
