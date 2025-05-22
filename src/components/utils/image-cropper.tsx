"use client";

import { CropIcon, RefreshCw, Trash2Icon } from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";
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
};

interface OriginalImageStore {
  file: File;
  dataUrl: string;
  fileName: string;
  fileType: string;
}

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
  getInputProps,
  getRootProps,
}: ImageCropperProps<TFieldValues, TName>) {
  const aspect = aspectRatio ?? 1;
  const imgRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
  const [originalImageStore, setOriginalImageStore] =
    useState<OriginalImageStore | null>(null);
  const [shouldOpenCropDialog, setShouldOpenCropDialog] = useState(false);

  const fileToDataUrl = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const cleanupBlobUrls = useCallback((urls: string[]) => {
    urls.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
  }, []);

  const resetCropStates = useCallback(() => {
    setCrop(undefined);
    if (croppedImageUrl) {
      cleanupBlobUrls([croppedImageUrl]);
    }
    setCroppedImageUrl("");
  }, [croppedImageUrl, cleanupBlobUrls]);

  const createFileWithPreview = useCallback(
    (file: File, previewUrl?: string): FileWithPreview => {
      const preview = previewUrl || URL.createObjectURL(file);
      const fileWithPreview = new File([file], file.name, {
        type: file.type,
      }) as FileWithPreview;
      Object.defineProperty(fileWithPreview, "preview", {
        value: preview,
        writable: true,
      });
      Object.defineProperty(fileWithPreview, "path", {
        value: file.name,
        writable: true,
      });
      return fileWithPreview;
    },
    []
  );

  const processNewOriginalImage = useCallback(
    async (file: File) => {
      try {
        if (selectedFile?.preview) {
          cleanupBlobUrls([selectedFile.preview]);
        }

        const dataUrl = await fileToDataUrl(file);
        const originalStore: OriginalImageStore = {
          file,
          dataUrl,
          fileName: file.name,
          fileType: file.type,
        };

        setOriginalImageStore(originalStore);
        const fileWithPreview = createFileWithPreview(file);
        setSelectedFile(fileWithPreview);
        resetCropStates();

        if (form && fieldName) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          form.setValue(fieldName, fileWithPreview as any, {
            shouldDirty: true,
          });
        }

        setShouldOpenCropDialog(true);
      } catch (error) {
        console.error("Error processing new image:", error);
        alert("Failed to process the image. Please try again.");
      }
    },
    [
      selectedFile?.preview,
      cleanupBlobUrls,
      fileToDataUrl,
      createFileWithPreview,
      resetCropStates,
      form,
      fieldName,
      setSelectedFile,
    ]
  );

  useEffect(() => {
    if (shouldOpenCropDialog && originalImageStore) {
      const timer = setTimeout(() => {
        setDialogOpen(true);
        setShouldOpenCropDialog(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [shouldOpenCropDialog, originalImageStore, setDialogOpen]);

  useEffect(() => {
    if (selectedFile && !originalImageStore) {
      const file = selectedFile as unknown as File;
      if (file instanceof File) {
        processNewOriginalImage(file);
      }
    }
  }, [selectedFile, originalImageStore, processNewOriginalImage]);

  useEffect(() => {
    return () => {
      if (selectedFile?.preview) {
        cleanupBlobUrls([selectedFile.preview]);
      }
      if (croppedImageUrl) {
        cleanupBlobUrls([croppedImageUrl]);
      }
    };
  }, [selectedFile?.preview, croppedImageUrl, cleanupBlobUrls]);

  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  function onCropComplete(crop: PixelCrop) {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImg = getCroppedImg(imgRef.current, crop);
      setCroppedImageUrl(croppedImg);
    }
  }

  function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const scaledWidth = crop.width * scaleX;
    const scaledHeight = crop.height * scaleY;
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
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
    return canvas.toDataURL("image/png");
  }

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
      if (croppedImageUrl && originalImageStore) {
        const filename = originalImageStore.fileName || "cropped-image.png";
        const croppedFile = dataURLtoFile(croppedImageUrl, filename);

        if (
          selectedFile?.preview &&
          selectedFile.preview !== originalImageStore.dataUrl
        ) {
          cleanupBlobUrls([selectedFile.preview]);
        }

        const croppedFileWithPreview = createFileWithPreview(
          croppedFile,
          croppedImageUrl
        );

        setSelectedFile(croppedFileWithPreview);

        if (form && fieldName) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          form.setValue(fieldName, croppedFileWithPreview as any, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          });
        }
      }
      setDialogOpen(false);
    } catch (error) {
      console.error("Error during image cropping:", error);
      alert("Something went wrong with the image cropping");
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      processNewOriginalImage(file);
    }
  };

  /**
   * Handle dialog close with crop state reset
   */
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetCropStates();
    }
    setDialogOpen(open);
  };

  // Use original image data for cropping (this solves the persistence issue)
  const imageToCrop = originalImageStore?.dataUrl || "";

  return (
    <>
      {/* File Input */}
      {getInputProps ? (
        <input ref={fileInputRef} {...getInputProps()} className="hidden" />
      ) : (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      )}

      {/* Image Preview Container */}
      <div className="relative group">
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
                variant="secondary"
                className="w-fit text-xs"
                onClick={() => setDialogOpen(true)}
              >
                <CropIcon className="mr-1.5 h-3 w-3" />
                Crop
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="w-fit text-xs"
                onClick={triggerFileInput}
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
            onClick={triggerFileInput}
          >
            <span className="text-xs text-muted-foreground">Add an image</span>
          </div>
        )}
      </div>

      {/* Crop Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="p-0 gap-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Crop the image</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-2 size-full">
            {imageToCrop && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => onCropComplete(c)}
                aspect={aspect}
                className="w-full"
                circularCrop={aspectRatio === 1}
              >
                <div className="w-full h-full rounded-none">
                  <Image
                    ref={imgRef}
                    className="w-full h-full rounded-none object-contain"
                    alt="Image cropper"
                    src={imageToCrop}
                    width={1600}
                    height={1600}
                    onLoad={onImageLoad}
                    unoptimized
                    priority
                  />
                </div>
              </ReactCrop>
            )}
          </div>
          <DialogFooter className="p-6 pt-0 justify-between">
            <Button
              size="sm"
              type="button"
              className="w-fit"
              variant="outline"
              onClick={triggerFileInput}
            >
              <RefreshCw className="mr-1.5 size-4" />
              Change image
            </Button>

            <div className="flex gap-2">
              <DialogClose asChild>
                <Button
                  size="sm"
                  type="reset"
                  className="w-fit"
                  variant="outline"
                >
                  <Trash2Icon className="mr-1.5 size-4" />
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                size="sm"
                className="w-fit"
                onClick={onCrop}
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

/**
 * Helper function to create centered aspect crop
 */
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
