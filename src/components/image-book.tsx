"use client";

import { Prisma } from "@prisma/client";
import { useAnimate } from "framer-motion";
import { ArrowLeft, ArrowRight, Info, FolderDown } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import JSZip from "jszip";
import { saveAs } from "file-saver";

type Props = {
  memories: Prisma.MemoryGetPayload<{
    include: {
      familyMembers: { select: { name: true } };
    };
  }>[];
};

export default function ImageBook({ memories }: Props) {
  const [index, setIndex] = React.useState(0);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      const { key } = e;
      switch (key) {
        case "ArrowLeft":
          back();
          break;
        case "ArrowRight":
          next();
          break;
        default:
          return;
      }
    }
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  });

  function next() {
    setIndex((index + 1) % memories.length);
    animate(
      "img",
      { opacity: [0, 1], x: [-200, 0] },
      { type: "spring", damping: 100, stiffness: 500 },
    );
  }

  function back() {
    setIndex((index - 1 + memories.length) % memories.length);
    animate(
      "img",
      { opacity: [0, 1], x: [200, 0] },
      { type: "spring", damping: 100, stiffness: 500 },
    );
  }

  const backwardsMemory =
    memories[(index - 1 + memories.length) % memories.length];
  const currentMemory = memories[index];
  const nextMemory = memories[(index + 1) % memories.length];

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
    <div className="w-full h-full flex justify-between items-center py-24">
      <Link
        href="/"
        className="fixed top-4 left-4 font-bold tracking-tighter text-xl text-accent"
      >
        Heritage Keeper
      </Link>
      <Button
        onClick={() =>
          handleDownloadAlbum(
            "album",
            memories.map((m) => m.fileUrl ?? ""),
          )
        }
        className="fixed top-4 right-4 font-bold tracking-tighter text-xl text-accent flex gap-2 items-center justify-center"
      >
        <FolderDown />
        <span>
          Download Pictures
        </span>
      </Button>

      <button
        className="opacity-0 hover:opacity-100 transition-opacity h-full px-4"
        onClick={back}
      >
        <ArrowLeft size={36} className="text-gray-700" />
      </button>

      <div className="h-full w-4/5" ref={scope}>
        <img
          src={backwardsMemory.fileUrl || ""}
          alt="Random"
          className="hidden"
        />

        <img
          src={currentMemory.fileUrl || ""}
          alt="Random"
          className="h-full object-contain rounded-md shadow-md mx-auto"
          loading="eager"
        />

        <img src={nextMemory.fileUrl || ""} alt="Random" className="hidden" />

        <p
          title={currentMemory.description ?? ""}
          className="text-lg text-gray-400 text-center line-clamp-2 my-2"
        >
          {currentMemory.description}
        </p>

        <div className="flex items-baseline justify-between ml-auto text-muted-foreground">
          <button className="border border-transparent hover:border-gray-700 hover:bg-gray-700/15 px-4 py-1 rounded-md transition-colors">
            {index + 1} / {memories.length}
          </button>

          <div className="flex items-baseline">
            <p className="text-sm w-fit">{currentMemory.date.toDateString()}</p>
            <Popover>
              <PopoverTrigger asChild>
                <button title="More info" className="w-fit h-fit">
                  <Info size={18} className="inline ml-2" />
                </button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                sideOffset={8}
                className="bg-gray-900 border-gray-900 text-gray-100 shadow"
              >
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold mb-4">Information</h2>

                  <ol className="space-y-2 text-gray-400">
                    <li>
                      <span className="font-semibold">Date:</span>{" "}
                      {currentMemory.date.toDateString()}
                    </li>
                    <li className="line-clamp-4">
                      <span className="font-semibold">Description: </span>
                      {currentMemory.description}
                    </li>
                    <li>
                      <span className="font-semibold">Family members:</span>
                      <span>
                        {" "}
                        {currentMemory.familyMembers
                          ?.map((m) => m.name)
                          .join(", ") || "None"}
                      </span>
                    </li>
                  </ol>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <button
        className="opacity-0 hover:opacity-100 transition-opacity h-full px-4"
        onClick={next}
      >
        <ArrowRight size={36} className="text-gray-700" />
      </button>
    </div>
  );
}
