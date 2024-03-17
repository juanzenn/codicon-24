"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { MouseEventHandler } from "react";

type DeleteMemoryModalProps = {
  title: string;
  description: string;
  disabled?: boolean;
  onConfirm: () => Promise<any>;
};

export function DeleteModal({
  title,
  description,
  disabled = false,
  onConfirm,
}: DeleteMemoryModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [image, setImage] = React.useState("/gonzalo.png");

  if (disabled) {
    return <></>;
  }

  async function handleConfirm() {
    setIsLoading(true);
    await onConfirm();
    setIsOpen(false);
    setIsLoading(false);
  }

  function handleImageChange(e: any) {
    let { id } = e.target;
    if (id === "cancel") {
      setImage("/gonzalo-sure.png");
    } else if (id === "confirm") {
      setImage("/gonzalo-scared.png");
    } else {
      setImage("/gonzalo.png");
    }
  }

  function handleOpenChange(open: boolean) {
    if (isLoading) {
      return;
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger onClick={() => setIsOpen(true)}>
        <Button variant={"ghost"}>
          <Trash2 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader id="main" onMouseOver={handleImageChange}>
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0">
              <Image src={image} width={150} height={150} alt="gonzalo" />
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <DialogTitle className="text-xl">{title}</DialogTitle>
              <DialogDescription className="mb-4">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <DialogClose disabled={isLoading} asChild>
            <Button
              id={"cancel"}
              disabled={isLoading}
              variant={"ghost"}
              className="w-full"
              onMouseOver={handleImageChange}
            >
              I changed my mind
            </Button>
          </DialogClose>
          <Button
            id="confirm"
            disabled={isLoading}
            variant={"destructive"}
            className="w-full"
            onClick={handleConfirm}
            onMouseOver={handleImageChange}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Yes, I'm absolutely sure"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
