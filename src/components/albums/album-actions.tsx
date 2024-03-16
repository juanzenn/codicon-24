import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Edit2, Trash2 } from "lucide-react";
import React from "react";
import { useDeleteAlbum } from "@/hooks/albums";
import { toast } from "../ui/use-toast";
import { UpdateAlbumForm } from "./update-album-form";
import { AlbumForm } from "@/app/validation/albums";
import { AlbumWithFamilyMembers } from "@/app/(dashboard)/albums/page";
import { FamilyMember } from "@prisma/client";

type AlbumActionsProps = {
  album: AlbumWithFamilyMembers;
  familyMembers: FamilyMember[];
};

export function AlbumActions({ album, familyMembers }: AlbumActionsProps) {
  const router = useRouter();
  const { mutate: deleteAlbum, isPending: isDeletingAlbum } = useDeleteAlbum();

  const [pendingTransition, startTransition] = React.useTransition();

  const albumFamilyMembers = album.memories
    .map((memory) => memory.familyMembers.map((member) => member.id))
    .flat();

  const albumForm = {
    date: album.date,
    description: album.description ?? "",
    familyMembers: Array.from(new Set([...albumFamilyMembers])),
    title: album.title,
    id: album.id,
  } satisfies AlbumForm & { id: string };

  function handleDeleteAlbum(albumId: string) {
    if (confirm("Are you sure you want to delete this album?")) {
      deleteAlbum(albumId, {
        onSuccess: () => {
          startTransition(() => {
            router.refresh();
          });

          toast({
            title: "Album deleted",
            description: `The album "${album.title}" has been deleted.`,
            variant: "success",
          });
        },
      });
    }
  }

  const isLoading = pendingTransition || isDeletingAlbum;

  return (
    <div className="text-center space-x-4">
      <UpdateAlbumForm album={albumForm} familyMembers={familyMembers}>
        <Button disabled={isLoading} variant="ghost" size="icon">
          <Edit2 size={16} />
        </Button>
      </UpdateAlbumForm>
      <Button
        disabled={isLoading}
        variant="ghost"
        size="icon"
        onClick={() => handleDeleteAlbum(album.id)}
        className="hover:bg-destructive hover:text-destructive-foreground"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
}
