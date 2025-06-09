import { ReactNode } from "react";
import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES } from "./constants";

export interface StepType {
  title: string;
  description: string;
  icon: ReactNode;
}

// Global validation schema
export const formSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  role: z.enum(["ARTIST", "USER"]),
  image: z
    .any()
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Accepted formats: .jpg, .jpeg, .png and .webp"
    ),
  bannerImage: z
    .any()
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Accepted formats: .jpg, .jpeg, .png and .webp"
    ),
  bio: z.string().min(1, "Bio is required"),
  website: z.string().url("Please enter a valid URL").or(z.literal("")),
  location: z.string().min(1, "Location is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
});

export type FormValues = z.infer<typeof formSchema>;
