"use client";

import { Button } from "@/components/ui/shadcn/button";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/shadcn/form";
import { Switch } from "@/components/ui/shadcn/switch";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserTemplate } from "@prisma/client";
import { CheckCircle, Eye, EyeOff, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { type Path, useForm } from "react-hook-form";
import { z, type ZodBoolean, type ZodObject, type ZodRawShape } from "zod";

type TemplateContainerProps<TShape extends ZodRawShape> = {
  children: ReactNode;
  schema: ZodObject<TShape>;
  onRequest?: (
    data: z.infer<ZodObject<TShape & { active: ZodBoolean }>>
  ) =>
    | Promise<z.infer<ZodObject<TShape & { active: ZodBoolean }>>>
    | z.infer<ZodObject<TShape & { active: ZodBoolean }>>;
  templateId?: number;
};

export function TemplateContainer<TShape extends ZodRawShape>({
  children,
  schema,
  templateId,
}: TemplateContainerProps<TShape>) {
  const extendedSchema = schema.extend({
    active: z.boolean().default(true),
  });

  type FormSchema = z.infer<typeof extendedSchema>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(extendedSchema),
    mode: "onSubmit",
  });

  const { data: session } = authClient.useSession();
  const [hasInitialData, setHasInitialData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const isActive = form.watch("active" as Path<FormSchema>) as boolean;

  useEffect(() => {
    if (!session || !session.user || !templateId) return;

    async function setFormExistingData() {
      try {
        const userResponse = await fetch(
          `/api/user/${session?.user.id}/templates`
        );
        const templates: UserTemplate[] = await userResponse.json();
        const currentTemplate = templates.find(
          (template) => template.templateId === templateId
        );

        if (currentTemplate?.data) {
          // @ts-expect-error it works as expected
          currentTemplate.data.active = currentTemplate.active ?? true;
          form.reset(currentTemplate.data as FormSchema);
          setHasInitialData(true);
        }
      } catch (error) {
        console.error("Error loading template data", error);
      } finally {
        setIsLoading(false);
      }
    }

    setFormExistingData();
  }, [session, form, templateId]);

  const onSubmit = async (values: FormSchema) => {
    setIsSubmitting(true);
    try {
      console.log(values);
      const payload = { ...values };
      const active = payload.active;
      delete payload.active;

      await fetch(`/api/templates`, {
        method: hasInitialData ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: payload,
          templateId,
          active,
        }),
      });

      setShowSuccess(true);
      setTimeout(() => {
        router.push("/settings/portfolio");
      }, 1500);
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Card className="p-8 shadow-lg ">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Loader2 className="w-8 h-8 text-gray-700 animate-spin" />
              <div className="absolute inset-0 w-8 h-8 border-2 border-gray-300 rounded-full animate-pulse" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold ">Loading Template</h3>
              <p className="text-sm ">
                Please wait while we load your settings...
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center">
        <Card className="p-8 shadow-lg">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <CheckCircle className="w-12 h-12 text-green-500" />
              <div className="absolute inset-0 w-12 h-12 border-2 border-gray-300 rounded-full animate-ping" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold ">Settings Saved!</h3>
              <p className="text-sm ">Redirecting...</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {children}

        {/* Template Status Card */}
        <Card className="shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name={"active" as Path<FormSchema>}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        {isActive ? (
                          <div className="p-2 rounded-lg">
                            <Eye className="w-5 h-5 text-green-600" />
                          </div>
                        ) : (
                          <div className="p-2  rounded-lg">
                            <EyeOff className="w-5 h-5 text-gray-600" />
                          </div>
                        )}
                        <div>
                          <FormLabel className="text-lg font-semibold ">
                            Template Status
                          </FormLabel>
                          <FormDescription className="text-sm  mt-1">
                            {isActive
                              ? "Your template is currently active and visible to visitors"
                              : "Your template is currently disabled and hidden from visitors"}
                          </FormDescription>
                        </div>
                      </div>
                    </div>
                    <FormControl>
                      <div className="flex items-center space-x-3">
                        <span className={`text-sm font-medium`}>
                          {isActive ? "Active" : "Inactive"}
                        </span>
                        <Switch
                          checked={field.value as boolean}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[140px] h-12 text-base font-medium"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
