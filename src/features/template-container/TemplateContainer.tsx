"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type TemplateContainerProps<TValues extends z.ZodTypeAny> = {
  children: ReactNode;
  schema: TValues;
  onRequest?: (
    data: z.infer<TValues>
  ) => Promise<z.infer<TValues>> | z.infer<TValues>;
  templateId?: number;
};

export function TemplateContainer<TValues extends z.ZodTypeAny>({
  children,
  schema,
  onRequest,
  templateId,
}: TemplateContainerProps<TValues>) {
  const form = useForm<z.infer<TValues>>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const { data: session } = authClient.useSession();

  if (!session || !session.user || session.user.role !== "ARTIST") {
    console.error("User not authenticated");
    return null;
  }

  const user = session.user;

  const onSubmit = async (values: z.infer<TValues>) => {
    try {
      let payload = { ...values };

      if (onRequest) {
        const modifiedPayload = await onRequest(payload);
        payload = modifiedPayload ?? payload;
      }

      const response = await fetch(`/api/templates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: payload,
          templateId,
          active: true,
        }),
      });

      const data = await response.json();

      console.log("Response", data);

      redirect(`/portfolio/${user.name}`);
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {children}

        <Button type="submit">Enregistrer</Button>
      </form>
    </Form>
  );
}
