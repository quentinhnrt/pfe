"use client";

import { Card } from "@/components/ui/shadcn/card";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import { Button } from "@/components/ui/shadcn/button";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Upload, X, Image as ImageIcon, Camera } from "lucide-react";

interface ImageUploadFieldProps {
  name: string;
  label?: string;
  existingImage?: string;
}

export function ImageUploadField({
  name,
  label = "Image",
  existingImage,
}: ImageUploadFieldProps) {
  const { control, setValue, watch } = useFormContext();
  const file = watch(name);
  const [preview, setPreview] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file && file instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [file]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setValue(name, droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setValue(name, selectedFile);
    }
  };

  const removeImage = () => {
    setValue(name, null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const hasImage = preview || existingImage;
  const displayImage = preview || existingImage;

  return (
    <Controller
      name={name}
      control={control}
      render={() => (
        <FormItem className="space-y-4">
          <FormLabel className="font-semibold text-base">
            {label}
          </FormLabel>

          <FormControl>
            <div className="space-y-4">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!hasImage ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={openFileDialog}
                  className={`relative border-2 border-dashed hover:border-solid rounded-lg p-8 text-center cursor-pointer transition-all duration-200`}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-gray-100 rounded-full">
                      <Upload className="w-8 h-8 text-gray-600" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium ">
                        Téléchargez une image
                      </p>
                      <p className="text-sm ">
                        Glissez-déposez votre image ici ou cliquez pour
                        parcourir
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, WEBP jusqu&apos;à 5MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="transition-all duration-200"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Choisir un fichier
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Card className="relative w-full max-w-md mx-auto overflow-hidden rounded-lg border-2 border-gray-300 shadow-lg">
                    <div className="aspect-square relative bg-gray-100">
                      {displayImage && (
                        <Image
                          src={displayImage}
                          alt="Prévisualisation"
                          fill
                          className="object-cover w-[12rem] h-[12rem]"
                        />
                      )}

                      <Button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-all duration-200"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="p-3 bg-white border-t border-gray-200 h-16">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1">
                          <ImageIcon className="w-3 h-3 text-gray-600" />
                          <span className="font-medium text-black truncate max-w-20">
                            {file instanceof File ? file.name : "Image"}
                          </span>
                        </div>
                        <Button
                          type="button"
                          onClick={openFileDialog}
                          variant="outline"
                          size="sm"
                          className="border border-gray-300 text-black hover:bg-gray-100 hover:border-black transition-all duration-200 text-xs px-2 py-1 h-6"
                        >
                          <Upload className="w-2 h-2 mr-1" />
                          Changer
                        </Button>
                      </div>

                      {file instanceof File && (
                        <div className="mt-1 text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </FormControl>

          <FormMessage className="text-red-600 font-medium" />
        </FormItem>
      )}
    />
  );
}
