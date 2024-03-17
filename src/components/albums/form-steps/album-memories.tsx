import { UpsertAlbumForm, selectMemoriesSchema } from "@/app/validation/albums";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MultipleSelect } from "@/components/ui/multiple-select";
import { handleZodError } from "@/lib/error";
import { cn } from "@/lib/utils";
import { FamilyMember, Memory } from "@prisma/client";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const FORM_IDS = {
  FAMILY_MEMBERS: "family-members",
};

type MemoriesSelectorStepProps = {
  album: UpsertAlbumForm;
  setAlbum: React.Dispatch<React.SetStateAction<UpsertAlbumForm>>;
  handleUpsertAlbum: (event: React.FormEvent<HTMLFormElement>) => void;
  availableMemories: Memory[];
  familyMembers: FamilyMember[];
  isLoading: boolean;
  back: () => void;
  isEdit?: boolean;
};

export function AlbumMemoriesSelector({
  back,
  album,
  setAlbum,
  isLoading,
  availableMemories,
  familyMembers,
  handleUpsertAlbum,
  isEdit,
}: MemoriesSelectorStepProps) {
  const submitButtonLabel = isEdit ? "Update Album" : "Create Album";
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

    handleUpsertAlbum(event);
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

        <div className="grid grid-cols-2 gap-4 space-y-1">
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
                  "absolute hidden w-full h-full top-0 left-0 bg-gray-400/45 border-2 border-transparent backdrop-blur-[1px] rounded-md transition-all",
                  album.selectedMemories.memories.includes(memory.id) &&
                    "flex justify-center items-center border-primary",
                )}
              >
                <Check size={48} />
              </div>
            </div>
          ))}
        </div>

        <footer className="flex gap-6">
          <Button onClick={back} className="w-full" variant="ghost">
            Back
          </Button>

          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              submitButtonLabel
            )}
          </Button>
        </footer>
      </form>
    </section>
  );
}
