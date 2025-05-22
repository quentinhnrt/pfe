import {
  ImageCropper,
  type FileWithPreview,
} from "@/components/utils/image-cropper";
import { type User } from "@prisma/client";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { type Dispatch, type SetStateAction } from "react";
import {
  type DropzoneInputProps,
  type DropzoneRootProps,
} from "react-dropzone";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";

interface BannerImageStepProps {
  bannerImage: FileWithPreview | null;
  setBannerImage: Dispatch<SetStateAction<FileWithPreview | null>>;
  bannerImageDialogOpen: boolean;
  setBannerImageDialogOpen: Dispatch<SetStateAction<boolean>>;
  getBannerRootProps: () => DropzoneRootProps;
  getBannerInputProps: () => DropzoneInputProps;
  user: User;
  form?: UseFormReturn<FormValues>;
}

export function BannerImageStep({
  bannerImage,
  setBannerImage,
  bannerImageDialogOpen,
  setBannerImageDialogOpen,
  getBannerRootProps,
  getBannerInputProps,
  user,
  form,
}: BannerImageStepProps) {
  return (
    <div className="flex flex-col items-center">
      <input
        {...getBannerInputProps()}
        aria-label="Add banner image"
        required
        className="sr-only"
      />

      {bannerImage?.preview ? (
        <ImageCropper
          dialogOpen={bannerImageDialogOpen}
          setDialogOpen={setBannerImageDialogOpen}
          selectedFile={bannerImage}
          setSelectedFile={setBannerImage}
          form={form}
          fieldName="bannerImage"
          aspectRatio={16 / 4}
        />
      ) : user.bannerImage ? (
        <div className="w-full aspect-[4/1] overflow-hidden rounded-md">
          <Image
            src={user.bannerImage}
            alt="Banner"
            width={800}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div
          {...getBannerRootProps()}
          className="cursor-pointer border-2 border-dashed border-muted-foreground/50 rounded-lg p-4 w-full aspect-[4/1] flex flex-col items-center justify-center hover:border-primary/50 transition-colors mb-4"
        >
          <ImageIcon className="w-16 h-16 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Click or drag and drop to add a banner image
          </p>
          <p className="text-xs text-red-500 mt-2">* This field is required</p>
        </div>
      )}
    </div>
  );
}
