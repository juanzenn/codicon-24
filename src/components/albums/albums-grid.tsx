"use client";

import { AlbumWithMemories } from "@/app/(dashboard)/albums/page";
import { getFormattedDate } from "@/lib/utils";
import {
  Calendar,
  FolderDown,
  Images,
  PencilIcon,
  User,
  Users2,
} from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { useDeleteAlbum } from "@/hooks/albums";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import { handleReactQueryError } from "@/lib/error";
import React, { startTransition } from "react";
import { DeleteModal } from "../DeleteModal";
import { AlbumForm } from "./upsert-album-form";
import { FamilyMember, Memory } from "@prisma/client";
import JSZip from "jszip";
import { saveAs } from "file-saver";

type AlbumsGridProps = {
  albums: AlbumWithMemories[];
  memories: Memory[];
  familyMembers: FamilyMember[];
};

export function AlbumsGrid({
  albums,
  familyMembers,
  memories,
}: AlbumsGridProps) {
  const router = useRouter();
  const { mutateAsync: deleteAlbum } = useDeleteAlbum();

  function handleAlbumDeletion(albumId: string) {
    return async () => {
      await deleteAlbum(albumId, {
        onSuccess: () => {
          toast({
            variant: "success",
            title: "Album Deleted",
            description: "The album was deleted successfuly",
          });

          startTransition(() => {
            router.refresh();
          });
        },
        onError: handleReactQueryError,
      });
    };
  }

  async function handleDownloadAlbum(
    albumName: string,
    memoriesUrls: string[],
  ) {
    const memoriesPromises = memoriesUrls.map(async (url) => {
      const response = await fetch(url);

      return response.blob();
    });

    const memoriesBlobs = await Promise.all(memoriesPromises);

    const zip = new JSZip();

    // TODO: maybe improve memories names?
    memoriesBlobs.forEach((blob, index) => {
      zip.file(`memory-${index + 1}.jpg`, blob);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `${albumName}.zip`);
  }

  return (
    <div className="grid grid-cols-4 gap-8">
      {albums.map((album) => (
        <div key={album.id} className="relative rounded w-full mb-4 group">
          <div className="absolute px-4 transition-all cursor-pointer text-white opacity-0 hover:opacity-75 w-full h-full bg-red flex flex-col items-center justify-center gap-2 z-20">
            <h2 className="line-clamp-4 text-lg font-semibold">
              {album.title}
            </h2>

            {album.description && (
              <p className="line-clamp-4 text-center ">{album.description}</p>
            )}

            <div className="flex gap-2">
              <Calendar />
              <span>{getFormattedDate(album.date)}</span>
            </div>

            <div className="flex gap-4">
              <Button asChild variant="ghost">
                <Link href={`/album/${album.id}`}>
                  <Images size={16} className="flex-shrink-0" />
                </Link>
              </Button>

              <Button
                onClick={() =>
                  handleDownloadAlbum(
                    album.title,
                    album.memories.map((m) => m.fileUrl ?? ""),
                  )
                }
                variant="ghost"
              >
                <FolderDown size={16} className="flex-shrink-0" />
              </Button>

              <AlbumForm
                key={album.id}
                familyMembers={familyMembers}
                memories={memories}
                preloadedAlbum={{
                  id: album.id,
                  details: {
                    title: album.title,
                    description: album.description ?? "",
                    date: album.date,
                  },
                  selectedMemories: {
                    memories: album.memories.map((memory) => memory.id),
                    familyMembers: Array.from(
                      new Set(
                        album.memories
                          .map((memory) =>
                            memory.familyMembers.map((m) => m.id),
                          )
                          .flat(),
                      ),
                    ),
                  },
                }}
              >
                <Button variant="ghost">
                  <PencilIcon size={16} className="flex-shrink-0" />
                </Button>
              </AlbumForm>

              <DeleteModal
                title="Are you sure?"
                description="This action cannot be undone. This will permanently delete your album and remove it from our servers."
                onConfirm={handleAlbumDeletion(album.id)}
              />
            </div>
          </div>
          <figure className="top-0 left-0 w-full h-[300px] group-hover:backdrop-blur-sm bg-black/80 group-hover:block hidden z-10 absolute transition-all rounded" />
          <figure className="relative h-[300px]">
            <Image
              className="rounded object-cover w-full h-[300px]"
              src={album.memories[0].fileUrl ?? "https://placehold.co/150x150"}
              alt={album.description ?? ""}
              fill
            />
          </figure>

          <AlbumFamilyMembersList album={album} />
        </div>
      ))}
    </div>
  );
}

type AlbumFamilyMembersListProps = {
  album: AlbumWithMemories;
};

function AlbumFamilyMembersList({ album }: AlbumFamilyMembersListProps) {
  const familyMembers = Array.from(
    new Set(
      album.memories
        .map((memory) => memory.familyMembers.map((member) => member.name))
        .flat(),
    ),
  );

  return (
    <footer className="mt-3 flex items-start gap-2">
      {familyMembers.length > 1 ? (
        <Users2 size={16} className="flex-shrink-0" />
      ) : (
        <User size={16} className="flex-shrink-0" />
      )}
      <span className="text-muted-foreground text-sm text-pretty">
        {familyMembers.join(", ")}
      </span>
    </footer>
  );
}
