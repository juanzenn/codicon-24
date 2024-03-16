"use client";

import { Memory } from "@prisma/client";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import React from "react";

type Props = {
  memories: Memory[];
};

export default function ImageBook({ memories }: Props) {
  const [index, setIndex] = React.useState(0);

  function next() {
    setIndex((index + 1) % memories.length);
  }

  function back() {
    setIndex((index - 1 + memories.length) % memories.length);
  }

  const currentMemory = memories[index];

  return (
    <div className="w-full h-full flex justify-between items-center py-24">
      <button
        className="opacity-0 hover:opacity-100 transition-opacity h-full px-4"
        onClick={back}
      >
        <ArrowLeft size={36} className="text-gray-700" />
      </button>

      <div className="h-full w-4/5">
        <img
          src={currentMemory.fileUrl || ""}
          alt="Random"
          className="h-full rounded-md shadow-md mx-auto"
        />

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
            <button title="More info" className="w-fit h-fit">
              <Info size={18} className="inline ml-2" />
            </button>
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
