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
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import {FieldPath, FieldValues, PathValue, UseFormReturn} from "react-hook-form";

export type FileWithPreview = FileWithPath & {
  preview: string;
};

interface ImageCropperProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFile: FileWithPreview | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<FileWithPreview | null>>;
  form?: UseFormReturn<TFieldValues>;
  fieldName?: TName;
  aspectRatio?: number;
}

export function ImageCropper<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  dialogOpen,
  setDialogOpen,
  selectedFile,
  setSelectedFile,
  form,
  fieldName,
  aspectRatio,
}: ImageCropperProps<TFieldValues, TName>) {
  // Default to 1:1 aspect ratio if none provided
  const aspect = aspectRatio !== undefined ? aspectRatio : 1;
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = React.useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = React.useState<string>("");
  const [croppedImage, setCroppedImage] = React.useState<string>("");
  const scale = 1; // Fixed scale value since we removed the slider

  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  function onCropComplete(crop: PixelCrop) {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(imgRef.current, crop, scale);
      setCroppedImageUrl(croppedImageUrl);
    }
  }

  function getCroppedImg(
    image: HTMLImageElement,
    crop: PixelCrop,
    scale: number
  ): string {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Calculate scaled dimensions
    const scaledWidth = crop.width * scaleX;
    const scaledHeight = crop.height * scaleY;

    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.imageSmoothingEnabled = false;

      // Calculate the scaled crop coordinates
      const sourceX = crop.x * scaleX;
      const sourceY = crop.y * scaleY;
      const sourceWidth = scaledWidth;
      const sourceHeight = scaledHeight;

      // Apply zoom/scale factor
      ctx.drawImage(
        image,
        sourceX - (sourceWidth * (scale - 1)) / 2,
        sourceY - (sourceHeight * (scale - 1)) / 2,
        sourceWidth * scale,
        sourceHeight * scale,
        0,
        0,
        scaledWidth,
        scaledHeight
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
        const filename = selectedFile.name || "cropped-profile.png";
        const croppedFile = dataURLtoFile(croppedImageUrl, filename);

        // Créer une nouvelle preview
        const croppedFileWithPreview = Object.assign(croppedFile, {
          preview: croppedImageUrl,
          path: selectedFile.path,
        }) as FileWithPreview;

        // Mettre à jour le state
        setSelectedFile(croppedFileWithPreview);

        // Mettre à jour le formulaire si disponible
        if (form && fieldName) {
          form.setValue(fieldName, croppedFile as PathValue<TFieldValues, TName>);
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
    if (croppedImage && selectedFile && form && fieldName) {
      const filename = selectedFile.name || "cropped-profile.png";
      const croppedFile = dataURLtoFile(croppedImage, filename);
      form.setValue(fieldName, croppedFile as PathValue<TFieldValues, TName>);
    }
  }, [croppedImage, selectedFile, form, fieldName]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        <Image
          src={croppedImage || selectedFile?.preview || ""}
          alt="Profile preview"
          width={144}
          height={144}
          className={cn(
            "w-full h-full cursor-pointer ring-2 ring-slate-200 rounded-sm",
            aspectRatio === 1 && "rounded-full"
          )}
        />
      </DialogTrigger>
      <DialogContent className="p-0 gap-0">
        <VisuallyHidden>
          <DialogTitle>Profile Image Cropper</DialogTitle>
        </VisuallyHidden>
        <div className="p-6 size-full">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => onCropComplete(c)}
            aspect={aspect}
            className="w-full"
            circularCrop={false}
          >
            <div className="w-full h-full rounded-none">
              <Image
                ref={imgRef}
                className="w-full h-full rounded-none object-contain"
                alt="Image cropper"
                src={selectedFile?.preview || ""}
                width={1600}
                height={1600}
                onLoad={onImageLoad}
                style={{ transform: `scale(${scale})` }}
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
        width: 50,
        height: 50,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}
