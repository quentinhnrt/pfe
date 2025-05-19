"use client";

import { CropIcon, Trash2Icon } from "lucide-react";
import React, { useEffect, type SyntheticEvent } from "react";
import { FileWithPath } from "react-dropzone";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormValues } from "@/features/on-boarding/types";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";

export type FileWithPreview = FileWithPath & {
  preview: string;
};

interface BannerImageCropperProps {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFile: FileWithPreview | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<FileWithPreview | null>>;
  form?: UseFormReturn<FormValues>;
}

export function BannerImageCropper({
  dialogOpen,
  setDialogOpen,
  selectedFile,
  setSelectedFile,
  form,
}: BannerImageCropperProps) {
  // Aspect ratio 16:4 (4:1)
  const aspect = 4;
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = React.useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = React.useState<string>("");
  const [croppedImage, setCroppedImage] = React.useState<string>("");

  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  function onCropComplete(crop: PixelCrop) {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(imgRef.current, crop);
      setCroppedImageUrl(croppedImageUrl);
    }
  }

  function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );
    }

    return canvas.toDataURL("image/png", 1.0);
  }

  // Convertir l'URL de données en fichier
  const dataURLtoFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  async function onCrop() {
    try {
      setCroppedImage(croppedImageUrl);

      // Convertir l'URL de l'image croppée en fichier
      if (croppedImageUrl && selectedFile) {
        const filename = selectedFile.name || "cropped-banner.png";
        const croppedFile = dataURLtoFile(croppedImageUrl, filename);

        // Créer une nouvelle preview
        const croppedFileWithPreview = Object.assign(croppedFile, {
          preview: croppedImageUrl,
          path: selectedFile.path,
        }) as FileWithPreview;

        // Mettre à jour le state
        setSelectedFile(croppedFileWithPreview);

        // Mettre à jour le formulaire si disponible
        if (form) {
          form.setValue("bannerImage", croppedFile);
        }
      }

      setDialogOpen(false);
    } catch (error) {
      console.error("Error during image cropping:", error);
      alert("Something went wrong with the image cropping");
    }
  }

  useEffect(() => {
    // Mettre à jour le formulaire si l'image croppée change
    if (croppedImage && selectedFile && form) {
      const filename = selectedFile.name || "cropped-banner.png";
      const croppedFile = dataURLtoFile(croppedImage, filename);
      form.setValue("bannerImage", croppedFile);
    }
  }, [croppedImage, selectedFile, form]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        <div className="cursor-pointer w-full aspect-[4/1] overflow-hidden rounded-md">
          <Image
            src={croppedImage || selectedFile?.preview || ""}
            alt="Banner preview"
            width={1600}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="p-0 gap-0 max-w-4xl">
        <VisuallyHidden>
          <DialogTitle>Banner Image Cropper</DialogTitle>
        </VisuallyHidden>
        <div className="p-6 w-full">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => onCropComplete(c)}
            aspect={aspect}
            className="w-full"
          >
            <div className="w-full rounded-none">
              <Image
                ref={imgRef}
                className="w-full rounded-none"
                alt="Image cropper"
                src={selectedFile?.preview || ""}
                onLoad={onImageLoad}
                width={1600}
                height={400}
              />
            </div>
          </ReactCrop>
        </div>
        <DialogFooter className="p-6 pt-0 justify-center">
          <DialogClose asChild>
            <Button
              size="sm"
              type="reset"
              className="w-fit"
              variant="outline"
              onClick={() => setSelectedFile(null)}
            >
              <Trash2Icon className="mr-1.5 size-4" />
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" size="sm" className="w-fit" onClick={onCrop}>
            <CropIcon className="mr-1.5 size-4" />
            Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
        height: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}
