"use client";

import { CropIcon, RefreshCw, Trash2Icon } from "lucide-react";
import React, { useRef, useState, type SyntheticEvent } from "react";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

export type FileWithPreview = FileWithPath & {
  preview: string;
  isExisting?: boolean;
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
  getInputProps?: () => Record<string, unknown>;
  getRootProps?: () => Record<string, unknown>;
  quality?: number;
  outputFormat?: "preserve" | "png" | "jpeg";
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
  getRootProps,
  quality = 1.0,
  outputFormat = "preserve",
}: ImageCropperProps<TFieldValues, TName>) {
  const aspect = aspectRatio ?? 1;
  const imgRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // États simples - pas de useCallback/useMemo
  const [crop, setCrop] = useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");

  // Fonctions directes sans useCallback
  function createFileWithPreview(
    file: File,
    isExisting = false
  ): FileWithPreview {
    const preview = URL.createObjectURL(file);
    return Object.assign(file, {
      preview,
      path: file.name,
      isExisting,
    }) as FileWithPreview;
  }

  function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Utiliser les dimensions naturelles pour la meilleure qualité
    const scaledWidth = crop.width * scaleX;
    const scaledHeight = crop.height * scaleY;

    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Paramètres pour la meilleure qualité
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Paramètres additionnels pour améliorer la qualité
      ctx.globalCompositeOperation = "source-over";

      const sourceX = crop.x * scaleX;
      const sourceY = crop.y * scaleY;

      ctx.drawImage(
        image,
        sourceX,
        sourceY,
        scaledWidth,
        scaledHeight,
        0,
        0,
        scaledWidth,
        scaledHeight
      );
    }

    // Déterminer le format de sortie
    let mimeType = "image/png";
    let qualityParam = undefined;

    if (outputFormat === "jpeg") {
      mimeType = "image/jpeg";
      qualityParam = quality;
      // Ajouter un fond blanc pour JPEG (pas de transparence)
      if (ctx) {
        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, scaledWidth, scaledHeight);
      }
    } else if (outputFormat === "preserve") {
      // Détecter le format original
      const originalFormat = image.src.toLowerCase();
      if (originalFormat.includes("jpg") || originalFormat.includes("jpeg")) {
        mimeType = "image/jpeg";
        qualityParam = quality;
        // Ajouter un fond blanc pour JPEG
        if (ctx) {
          ctx.globalCompositeOperation = "destination-over";
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, scaledWidth, scaledHeight);
        }
      }
    }

    return canvas.toDataURL(mimeType, qualityParam);
  }

  function dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch?.[1] || "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    let finalFilename = filename;
    if (
      mime.includes("jpeg") &&
      !filename.toLowerCase().includes(".jpg") &&
      !filename.toLowerCase().includes(".jpeg")
    ) {
      finalFilename = filename.replace(/\.[^/.]+$/, "") + ".jpg";
    } else if (
      mime.includes("png") &&
      !filename.toLowerCase().includes(".png")
    ) {
      finalFilename = filename.replace(/\.[^/.]+$/, "") + ".png";
    }

    return new File([u8arr], finalFilename, { type: mime });
  }

  // Gestionnaires d'événements directs
  async function handleFileSelection(file: File) {
    console.log("Handling file selection:", file.name);

    try {
      // Nettoyer l'ancienne image
      if (selectedFile?.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(selectedFile.preview);
      }

      // Créer le nouveau FileWithPreview
      const newFileWithPreview = createFileWithPreview(file, false);
      setSelectedFile(newFileWithPreview);

      // Mettre à jour le formulaire
      if (form && fieldName) {
        form.setValue(
          fieldName,
          newFileWithPreview as unknown as TFieldValues[TName],
          {
            shouldDirty: true,
            shouldValidate: true,
          }
        );
      }

      // Réinitialiser le crop
      setCrop(undefined);
      setCroppedImageUrl("");

      // Ouvrir le dialogue de crop
      setTimeout(() => setDialogOpen(true), 100);
    } catch (error) {
      console.error("Error handling file selection:", error);
      alert("Failed to process the image. Please try again.");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
    // Réinitialiser l'input
    e.target.value = "";
  }

  function openFileSelector() {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  }

  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      const initialCrop = centerAspectCrop(width, height, aspect);
      setCrop(initialCrop);

      // Générer la preview initiale
      setTimeout(() => {
        if (imgRef.current && initialCrop.width && initialCrop.height) {
          const pixelCrop: PixelCrop = {
            x: (initialCrop.x / 100) * width,
            y: (initialCrop.y / 100) * height,
            width: (initialCrop.width / 100) * width,
            height: (initialCrop.height / 100) * height,
            unit: "px",
          };

          const croppedImg = getCroppedImg(imgRef.current, pixelCrop);
          setCroppedImageUrl(croppedImg);
        }
      }, 100);
    }
  }

  function onCropComplete(crop: PixelCrop) {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImg = getCroppedImg(imgRef.current, crop);
      setCroppedImageUrl(croppedImg);
    }
  }

  async function applyCrop() {
    if (!croppedImageUrl || !selectedFile) {
      return;
    }

    try {
      // Nettoyer l'ancienne preview
      if (selectedFile.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(selectedFile.preview);
      }

      // Déterminer le format et l'extension
      const originalName = selectedFile.name;
      const isOriginalJpeg =
        originalName.toLowerCase().includes("jpg") ||
        originalName.toLowerCase().includes("jpeg");

      let extension = ".png";
      if (outputFormat === "jpeg") {
        extension = ".jpg";
      } else if (outputFormat === "preserve" && isOriginalJpeg) {
        extension = ".jpg";
      }

      // Créer le nom de fichier avec le bon format
      const filename =
        originalName.replace(/\.[^/.]+$/, "") + "-cropped" + extension;

      const croppedFile = dataURLtoFile(croppedImageUrl, filename);

      console.log(
        `Image croppée sauvegardée: ${croppedFile.name}, Taille: ${(croppedFile.size / 1024 / 1024).toFixed(2)}MB, Type: ${croppedFile.type}, Qualité: ${quality}`
      );

      // Créer le nouveau FileWithPreview
      const croppedFileWithPreview = createFileWithPreview(croppedFile, false);

      // Mettre à jour les états
      setSelectedFile(croppedFileWithPreview);

      // Mettre à jour le formulaire
      if (form && fieldName) {
        form.setValue(
          fieldName,
          croppedFileWithPreview as unknown as TFieldValues[TName],
          {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          }
        );
        await form.trigger(fieldName);
      }

      // Fermer le dialog
      setDialogOpen(false);
    } catch (error) {
      console.error("Error applying crop:", error);
      alert("Something went wrong with the image cropping");
    }
  }

  function handleDialogClose(open: boolean) {
    if (!open) {
      // Nettoyer l'URL de crop
      if (croppedImageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(croppedImageUrl);
      }
      setCroppedImageUrl("");
      setCrop(undefined);
    }
    setDialogOpen(open);
  }

  // Source d'image pour le crop (utilise preview ou convertit en dataURL)
  const [imageSrc, setImageSrc] = useState<string>("");

  // Préparer l'image pour le crop quand le dialog s'ouvre
  React.useEffect(() => {
    if (dialogOpen && selectedFile && !imageSrc) {
      if (selectedFile.preview.startsWith("blob:")) {
        // Pour les nouvelles images, utiliser directement la preview
        setImageSrc(selectedFile.preview);
      } else {
        // Pour les images existantes, convertir en dataURL avec la meilleure qualité
        const file = selectedFile as unknown as File;
        if (file instanceof File) {
          // Utiliser FileReader pour préserver la qualité maximale
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            setImageSrc(result);
          };
          reader.readAsDataURL(file);
        } else {
          // Fallback pour les URLs HTTP
          setImageSrc(selectedFile.preview);
        }
      }
    } else if (!dialogOpen) {
      setImageSrc("");
    }
  }, [dialogOpen, selectedFile, imageSrc]);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="group">
        {selectedFile?.preview ? (
          <>
            <Image
              src={selectedFile.preview}
              alt="Preview"
              width={144}
              height={144}
              className={cn(
                "w-full h-full cursor-pointer ring-2 ring-slate-200 rounded-sm",
                aspectRatio === 1 && "rounded-full"
              )}
              onClick={() => setDialogOpen(true)}
            />
            <div
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                size="sm"
                type="button"
                variant="secondary"
                className="w-fit text-xs"
                onClick={() => setDialogOpen(true)}
              >
                <CropIcon className="mr-1.5 h-3 w-3" />
                Crop
              </Button>
              <Button
                size="sm"
                type="button"
                variant="secondary"
                className="w-fit text-xs"
                onClick={openFileSelector}
              >
                <RefreshCw className="mr-1.5 h-3 w-3" />
                Replace
              </Button>
            </div>
          </>
        ) : getRootProps ? (
          <div
            {...getRootProps()}
            className={cn(
              "w-full h-full cursor-pointer border-2 border-dashed border-muted-foreground/50 rounded-sm flex items-center justify-center hover:border-primary/50 transition-colors",
              aspectRatio === 1 && "rounded-full"
            )}
          >
            <span className="text-xs text-muted-foreground">Add an image</span>
          </div>
        ) : (
          <div
            className={cn(
              "w-full h-full cursor-pointer border-2 border-dashed border-muted-foreground/50 rounded-sm flex items-center justify-center hover:border-primary/50 transition-colors",
              aspectRatio === 1 && "rounded-full"
            )}
            onClick={openFileSelector}
          >
            <span className="text-xs text-muted-foreground">Add an image</span>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="p-0 gap-0 overflow-y-auto max-h-[90vh]">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Crop the image</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-2 size-full">
            {imageSrc ? (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={onCropComplete}
                aspect={aspect}
                className="w-full"
                circularCrop={aspectRatio === 1}
              >
                <div className="w-full h-full rounded-none">
                  <Image
                    ref={imgRef}
                    className="w-full h-full rounded-none object-contain"
                    alt="Image cropper"
                    src={imageSrc}
                    width={1600}
                    height={1600}
                    onLoad={onImageLoad}
                    unoptimized
                    priority
                  />
                </div>
              </ReactCrop>
            ) : (
              <div className="w-full h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading image...
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="p-6 pt-0 justify-between">
            <Button
              size="sm"
              type="button"
              className="w-fit"
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setTimeout(openFileSelector, 100);
              }}
            >
              <RefreshCw className="mr-1.5 size-4" />
              Change image
            </Button>

            <div className="flex gap-2">
              <DialogClose asChild>
                <Button
                  size="sm"
                  type="button"
                  className="w-fit"
                  variant="outline"
                >
                  <Trash2Icon className="mr-1.5 size-4" />
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                size="sm"
                className="w-fit"
                onClick={applyCrop}
                disabled={!croppedImageUrl}
              >
                <CropIcon className="mr-1.5 size-4" />
                Crop
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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
