import { CreateAlbumForm } from "@/components/albums/create-album-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function AlbumsPage() {
  return (
    <div className="container">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus size={24} className="mr-2" />
            <span>Create album</span>
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new album</DialogTitle>
            <DialogDescription>
              <span>
                Take a snapshot of your favorite memories with your family and
                save it into an
              </span>
              <span className="text-primary font-bold"> album.</span>
            </DialogDescription>
          </DialogHeader>

          <CreateAlbumForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
