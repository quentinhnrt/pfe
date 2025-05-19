"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormValues } from "@/features/on-boarding/types";
import { nanoid } from "nanoid";
import { UseFormReturn } from "react-hook-form";

interface ProfileDetailsStepProps {
  form: UseFormReturn<FormValues>;
  firstname: string;
  lastname: string;
}

export function ProfileDetailsStep({
  form,
  firstname,
  lastname,
}: ProfileDetailsStepProps) {
  const suggestedUsername = `${firstname.toLowerCase()}-${lastname.toLowerCase()}-${nanoid(2)}`;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="username">
                Username <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="username"
                  placeholder="Username"
                  {...field}
                  aria-describedby="username-description"
                  required
                />
              </FormControl>
              <FormDescription className="text-xs text-muted-foreground">
                Suggestion: {suggestedUsername}
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
              <FormLabel>
                Location <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Localisation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div>
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="bio">
                Bio <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  id="bio"
                  placeholder="Describe yourself in a few words"
                  rows={5}
                  {...field}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="w-full">
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="website">Website</FormLabel>
              <FormControl>
                <Input
                  id="website"
                  placeholder="https://your-website.com"
                  type="url"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription className="text-xs text-muted-foreground">
                Optional: Enter your website URL
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
