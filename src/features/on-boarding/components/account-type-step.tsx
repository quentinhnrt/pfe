import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/shadcn/radio-group";
import { MusicIcon, UserIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";

interface AccountTypeStepProps {
  form: UseFormReturn<FormValues>;
  role: string;
}

export function AccountTypeStep({ form, role }: AccountTypeStepProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto">
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem className="col-span-1 md:col-span-2">
            <FormLabel className="sr-only">Account Type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col sm:flex-row gap-6"
                required
              >
                <FormItem className="w-full">
                  <FormControl>
                    <RadioGroupItem
                      value="USER"
                      className="peer sr-only"
                      id="role-user"
                      aria-required="true"
                    />
                  </FormControl>
                  <label
                    htmlFor="role-user"
                    className={
                      "flex flex-col items-center justify-center gap-4 rounded-2xl border-2 p-8 cursor-pointer transition-all " +
                      (role === "USER"
                        ? "bg-primary/10 border-primary"
                        : "border-muted hover:border-primary/40")
                    }
                  >
                    <UserIcon className="w-12 h-12" />
                    <span className="text-lg font-medium">User</span>
                  </label>
                </FormItem>

                <FormItem className="w-full">
                  <FormControl>
                    <RadioGroupItem
                      value="ARTIST"
                      className="peer sr-only"
                      id="role-artist"
                      aria-required="true"
                    />
                  </FormControl>
                  <label
                    htmlFor="role-artist"
                    className={
                      "flex flex-col items-center justify-center gap-4 rounded-2xl border-2 p-8 cursor-pointer transition-all " +
                      (role === "ARTIST"
                        ? "bg-primary/10 border-primary"
                        : "border-muted hover:border-primary/40")
                    }
                  >
                    <MusicIcon className="w-12 h-12" />
                    <span className="text-lg font-medium">Artist</span>
                  </label>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
