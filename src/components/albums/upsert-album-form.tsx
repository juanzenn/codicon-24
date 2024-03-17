"use client";

import { UpsertAlbumForm, upsertAlbumSchema } from "@/app/validation/albums";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateAlbum, useUpdateAlbum } from "@/hooks/albums";
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

const EMPTY_ALBUM_FORM = {
  details: {
    date: new Date(),
    description: "",
    title: "",
  },
  selectedMemories: {
    familyMembers: [],
    memories: [],
  },
} satisfies UpsertAlbumForm;

type AlbumFormProps = {
  memories: Memory[];
  familyMembers: FamilyMember[];
  children: React.ReactNode;
  preloadedAlbum?: UpsertAlbumForm & { id: string };
};

export function AlbumForm({
  familyMembers,
  memories,
  children,
  preloadedAlbum,
}: AlbumFormProps) {
  const baseAlbum = preloadedAlbum ? preloadedAlbum : EMPTY_ALBUM_FORM;

  const router = useRouter();
  const { mutate: createAlbum, isPending: isCreatingAlbum } = useCreateAlbum();
  const { mutate: updateAlbum, isPending: isUpdatingAlbum } = useUpdateAlbum();

  const [isPendingTransition, startTransition] = React.useTransition();
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [album, setAlbum] = React.useState<UpsertAlbumForm>(baseAlbum);

  const [activeStep, setActiveStep] = React.useState(0);
  const currentStep = CREATE_ALBUM_STEPS[activeStep];

  const isLoading = isCreatingAlbum || isUpdatingAlbum || isPendingTransition;

  function nextStep() {
    setActiveStep((prev) => prev + 1);
  }

  function prevStep() {
    setActiveStep((prev) => prev - 1);
  }

  async function handleUpsertAlbum(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validatedBody = upsertAlbumSchema.safeParse(album);

    if (!validatedBody.success) {
      handleZodError(validatedBody.error);
      return;
    }

    if (preloadedAlbum) {
      console.log({
        ...validatedBody.data,
        id: preloadedAlbum.id,
      });

      updateAlbum(
        { ...validatedBody.data, id: preloadedAlbum.id },
        {
          onSuccess: () => {
            toast({
              variant: "success",
              title: "Album Updated",
              description: "The album has been updated successfully.",
            });

            startTransition(() => {
              router.refresh();
            });

            setIsOpenModal(false);
          },
          onError: handleReactQueryError,
        },
      );
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
          setAlbum(EMPTY_ALBUM_FORM);
        }, 200);

        setIsOpenModal(false);
      },

      onError: handleReactQueryError,
    });
  }

  const handleOpenModalChange = () => {
    if (isOpenModal) {
      setAlbum(baseAlbum);
    }

    setActiveStep(0);
    setIsOpenModal(!isOpenModal);
  };

  return (
    <Dialog open={isOpenModal} onOpenChange={handleOpenModalChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-h-[750px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {preloadedAlbum ? "Edit Album" : "Create Album"}
          </DialogTitle>
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
            handleUpsertAlbum={handleUpsertAlbum}
            isLoading={isLoading}
            setAlbum={setAlbum}
            isEdit={Boolean(preloadedAlbum)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
