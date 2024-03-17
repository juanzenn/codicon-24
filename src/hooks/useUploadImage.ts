import { useUploadThing } from "@/lib/files";
import imageCompression from "browser-image-compression";
import { nanoid } from "nanoid";

type UploadResponse = {
  url: string;
}[];

export function useUploadImage() {
  const { startUpload, isUploading } = useUploadThing("imageUploader");

  async function uploadImage(file: File, identifier?: string) {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 4,
      maxWidthOrHeight: 1920,
      alwaysKeepResolution: true,
      useWebWorker: true,
    });

    const extension = compressedFile.name.split(".").pop();
    const imageId = identifier ?? nanoid();
    const identifiedFile = new File(
      [compressedFile],
      `${imageId}.${extension}`,
    );
    const [{ url }] = (await startUpload([identifiedFile])) as UploadResponse;

    return url;
  }

  return { uploadImage, isUploading };
}
