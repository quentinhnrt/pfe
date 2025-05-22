"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FileWithPreview,
  ImageCropper,
} from "@/components/utils/image-cropper";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  bio: z
    .string()
    .max(500, {
      message: "Bio must not be longer than 500 characters.",
    })
    .optional(),
  location: z
    .string()
    .max(100, {
      message: "Location must not be longer than 100 characters.",
    })
    .optional(),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  image: z.any().optional(),
  bannerImage: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface User {
  id: string;
  name?: string;
  firstname?: string;
  lastname?: string;
  bio?: string;
  location?: string;
  website?: string;
  image?: string;
  bannerImage?: string;
  role?: string;
}

export function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image cropper state
  const [profileImageDialogOpen, setProfileImageDialogOpen] = useState(false);
  const [bannerImageDialogOpen, setBannerImageDialogOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<FileWithPreview | null>(
    null
  );
  const [bannerImage, setBannerImage] = useState<FileWithPreview | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || "",
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      bio: user.bio || "",
      location: user.location || "",
      website: user.website || "",
      image: user.image || "",
      bannerImage: user.bannerImage || "",
    },
  });

  const createFileWithPreviewFromUrl = async (
    url: string,
    filename: string
  ): Promise<FileWithPreview | null> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const file = new File([blob], filename, { type: blob.type });

      const fileWithPreview = file as FileWithPreview;
      Object.defineProperty(fileWithPreview, "preview", {
        value: url,
        writable: true,
      });
      Object.defineProperty(fileWithPreview, "path", {
        value: filename,
        writable: true,
      });
      Object.defineProperty(fileWithPreview, "isExisting", {
        value: true,
        writable: true,
      });

      return fileWithPreview;
    } catch (error) {
      console.error("Error creating FileWithPreview from URL:", error);
      return null;
    }
  };

  useEffect(() => {
    const initializeExistingImages = async () => {
      if (user.image && !profileImage) {
        const profileFileWithPreview = await createFileWithPreviewFromUrl(
          user.image,
          "existing-profile.jpg"
        );
        if (profileFileWithPreview) {
          setProfileImage(profileFileWithPreview);
        }
      }

      if (user.bannerImage && !bannerImage) {
        const bannerFileWithPreview = await createFileWithPreviewFromUrl(
          user.bannerImage,
          "existing-banner.jpg"
        );
        if (bannerFileWithPreview) {
          setBannerImage(bannerFileWithPreview);
        }
      }
    };

    initializeExistingImages();
  }, [user.image, user.bannerImage, profileImage, bannerImage]);

  async function onSubmit(data: ProfileFormValues) {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // Map the form data to match the expected format
      formData.append("firstname", data.firstname || "");
      formData.append("lastname", data.lastname || "");
      formData.append("bio", data.bio || "");
      formData.append("location", data.location || "");
      formData.append("website", data.website || "");
      formData.append("username", user.name || "");
      formData.append("role", user.role || "USER");

      // Handle profile image
      if (profileImage && profileImage instanceof File) {
        try {
          if (
            profileImage.preview.startsWith("blob:") ||
            profileImage.preview.startsWith("data:")
          ) {
            const response = await fetch(profileImage.preview);
            const blob = await response.blob();
            formData.append("image", blob, "profile.jpg");
          } else {
            formData.append(
              "image",
              profileImage,
              profileImage.name || "profile.jpg"
            );
          }
        } catch (err) {
          console.error("Error processing profile image:", err);
        }
      }

      // Handle banner image
      if (bannerImage && bannerImage instanceof File) {
        try {
          if (
            bannerImage.preview.startsWith("blob:") ||
            bannerImage.preview.startsWith("data:")
          ) {
            const response = await fetch(bannerImage.preview);
            const blob = await response.blob();
            formData.append("bannerImage", blob, "banner.jpg");
          } else {
            formData.append(
              "bannerImage",
              bannerImage,
              bannerImage.name || "banner.jpg"
            );
          }
        } catch (err) {
          console.error("Error processing banner image:", err);
        }
      }

      const response = await fetch(`/api/user/${user.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update profile");
      }

      toast.success("Profile updated", {
        description: "Your profile has been updated successfully.",
      });

      // Refresh the page
      router.refresh();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Error updating profile", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <FormLabel>Banner Image</FormLabel>
          <div className="relative w-full overflow-hidden rounded-lg border">
            <FormField
              control={form.control}
              name="bannerImage"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div className="h-full w-full">
                      <ImageCropper
                        dialogOpen={bannerImageDialogOpen}
                        setDialogOpen={setBannerImageDialogOpen}
                        selectedFile={bannerImage}
                        setSelectedFile={setBannerImage}
                        form={form}
                        fieldName="bannerImage"
                        aspectRatio={16 / 4}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <FormLabel>Profile Picture</FormLabel>
          <div className="relative h-[100px] w-[100px] overflow-hidden rounded-full border">
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div className="h-full w-full">
                      <ImageCropper
                        dialogOpen={profileImageDialogOpen}
                        setDialogOpen={setProfileImageDialogOpen}
                        selectedFile={profileImage}
                        setSelectedFile={setProfileImage}
                        form={form}
                        fieldName="image"
                        aspectRatio={1}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John"
                    {...field}
                    value={field.value || ""}
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
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Doe"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Brief description for your profile. Max 500 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="Paris, France"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update profile"}
        </Button>
      </form>
    </Form>
  );
}
