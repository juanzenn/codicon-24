import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function MemoryDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Upload Memory</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Memory</DialogTitle>
                    <DialogDescription>
                        Tag your loved ones and add a description of the memory you're uploading
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="submit">Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
