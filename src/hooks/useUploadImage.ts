import { useUploadThing } from "@/lib/files";
import { nanoid } from "nanoid";

type UploadResponse = {
  url: string;
}[];

export function useUploadImage() {
  const { startUpload, isUploading } = useUploadThing("imageUploader");

  async function uploadImage(file: File, identifier?: string) {
    const extension = file.name.split(".").pop();
    const imageId = identifier ?? nanoid();
    const newFile = new File([file], `${imageId}.${extension}`);
    const [{ url }] = (await startUpload([newFile])) as UploadResponse;

    return url;
  }

  return { uploadImage, isUploading };
}
