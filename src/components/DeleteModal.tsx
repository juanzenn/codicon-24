'use client'
import React from "react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type DeleteMemoryModalProps = {
    title: string;
    description: string;
    disabled: boolean;
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


    if (disabled) {
        return <></>
    }

    async function handleConfirm() {
        setIsLoading(true);
        await onConfirm();
        setIsOpen(false);
        setIsLoading(false);
    }

    function handleOpenChange(open: boolean) {
        if (isLoading) {
            return;
        }
        setIsOpen(open)
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger onClick={() => setIsOpen(true)}>
                <Button variant={"ghost"}>
                    <Trash2 size={16} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-center gap-8">
                        <div className="flex-shrink-0">
                            <Image
                                src={"/gonzalo.png"}
                                width={150}
                                height={150}
                                alt="gonzalo"
                            />
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
                        <Button disabled={isLoading} variant={"ghost"} className="w-full">
                            I changed my mind
                        </Button>
                    </DialogClose>
                    <Button
                        disabled={isLoading}
                        variant={"destructive"}
                        className="w-full"
                        onClick={handleConfirm}
                    >
                        Yes, I'm absolutely sure
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}