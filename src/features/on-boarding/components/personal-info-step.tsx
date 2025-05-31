import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import {
  ImageCropper,
  type FileWithPreview,
} from "@/components/utils/image-cropper";
import { type User } from "@prisma/client";
import { UserCircleIcon } from "lucide-react";
import Image from "next/image";
import { type Dispatch, type SetStateAction } from "react";
import {
  type DropzoneInputProps,
  type DropzoneRootProps,
} from "react-dropzone";
import { type UseFormReturn } from "react-hook-form";
import { type FormValues } from "../types";

interface PersonalInfoStepProps {
  form: UseFormReturn<FormValues>;
  profileImage: FileWithPreview | null;
  setProfileImage: Dispatch<SetStateAction<FileWithPreview | null>>;
  profileImageDialogOpen: boolean;
  setProfileImageDialogOpen: Dispatch<SetStateAction<boolean>>;
  getProfileRootProps: () => DropzoneRootProps;
  getProfileInputProps: () => DropzoneInputProps;
  user: User;
}

export function PersonalInfoStep({
  form,
  profileImage,
  setProfileImage,
  profileImageDialogOpen,
  setProfileImageDialogOpen,
  getProfileRootProps,
  getProfileInputProps,
  user,
}: PersonalInfoStepProps) {
  return (
    <>
      <div className="flex justify-center mb-8">
        <div>
          <div className="cursor-pointer">
            <input
              {...getProfileInputProps()}
              aria-label="Add profile picture"
              required
            />
            <div className="flex flex-col items-center">
              <div className="mb-1 w-40 h-40">
                {profileImage?.preview ? (
                  <ImageCropper
                    dialogOpen={profileImageDialogOpen}
                    setDialogOpen={setProfileImageDialogOpen}
                    selectedFile={profileImage}
                    setSelectedFile={setProfileImage}
                    form={form}
                    fieldName="image"
                    aspectRatio={1 / 1}
                  />
                ) : user.image ? (
                  <Image
                    src={user.image}
                    alt="Profile picture"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div
                    {...getProfileRootProps()}
                    className="w-full h-full rounded-full border-2 border-dashed border-muted-foreground/50 flex flex-col items-center justify-center hover:border-primary/50 transition-colors"
                  >
                    <UserCircleIcon className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              <p className="text-sm font-semibold">
                Click to add a profile picture{" "}
                <span className="text-red-500">*</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="firstname">
                First name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="firstname"
                  placeholder="First name"
                  {...field}
                  aria-required="true"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="lastname">
                Last name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="lastname"
                  placeholder="Last name"
                  {...field}
                  aria-required="true"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
