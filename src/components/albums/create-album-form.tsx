"use client";

import { CreateAlbumForm, createAlbumSchema } from "@/app/validation/albums";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateAlbum } from "@/hooks/albums";
import { handleReactQueryError, handleZodError } from "@/lib/error";
import { FamilyMember, Memory } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "../ui/use-toast";
import { AlbumDetailsFormStep } from "./form-steps/album-details";
import { AlbumMemoriesSelector } from "./form-steps/album-memories";
import { AlbumMemoriesStepper } from "./form-steps/album-stepper";

const CREATE_ALBUM_STEPS = [
  {
    id: "ALBUM_DETAILS",
    title: "Album Details",
    description: "Fill in the details of your album.",
  },
  {
    id: "SELECT_MEMORIES",
    title: "Select Memories",
    description: "Choose the memories you want to include in your album.",
  },
] as const;

type AlbumFormProps = {
  memories: Memory[];
  familyMembers: FamilyMember[];
};

const INITIAL_ALBUM_FORM = {
  details: {
    date: new Date(),
    description: "",
    title: "",
  },
  selectedMemories: {
    familyMembers: [],
    memories: [],
  },
} satisfies CreateAlbumForm;

export function CreateAlbumForm({ familyMembers, memories }: AlbumFormProps) {
  const router = useRouter();
  const { mutate: createAlbum, isPending: isCreatingAlbum } = useCreateAlbum();
  const [isPendingTransition, startTransition] = React.useTransition();
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [album, setAlbum] = React.useState<CreateAlbumForm>(INITIAL_ALBUM_FORM);

  const [activeStep, setActiveStep] = React.useState(0);
  const currentStep = CREATE_ALBUM_STEPS[activeStep];

  const isLoading = isCreatingAlbum || isPendingTransition;

  function nextStep() {
    setActiveStep((prev) => prev + 1);
  }

  function prevStep() {
    setActiveStep((prev) => prev - 1);
  }

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
          setAlbum(INITIAL_ALBUM_FORM);
        }, 200);

        setIsOpenModal(false);
      },
      onError: handleReactQueryError,
    });
  }

  const handleOpenModalChange = () => {
    if (isOpenModal) {
      setAlbum(INITIAL_ALBUM_FORM);
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

        <AlbumMemoriesStepper activeStep={activeStep} />

        {currentStep.id === "ALBUM_DETAILS" && (
          <AlbumDetailsFormStep
            album={album}
            next={nextStep}
            setAlbum={setAlbum}
          />
        )}

        {currentStep.id === "SELECT_MEMORIES" && (
          <AlbumMemoriesSelector
            album={album}
            availableMemories={memories}
            back={prevStep}
            familyMembers={familyMembers}
            handleCreateAlbum={handleCreateAlbum}
            isLoading={isLoading}
            setAlbum={setAlbum}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
