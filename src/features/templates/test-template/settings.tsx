"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TemplateContainer } from "@/features/template-container/TemplateContainer";
import { z } from "zod";
import {CollectionSelector} from "@/features/fields/CollectionSelector";

export const templateSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    collections: z.array(z.number()).optional(),
});

export default function Settings() {
    async function onRequest(values: z.infer<typeof templateSchema>) {
    console.log(values);

    return values;
  }

  return (
    <div>
      <h1>Template Exemple Settings</h1>
      <p>Settings for the Template Exemple component.</p>
      <TemplateContainer
        schema={templateSchema}
        onRequest={onRequest}
        templateId={1}
      >
        <FormField
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder={"Titre"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder={"Description"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="collections"
          render={(field) => (
            <FormItem>
              <FormLabel>Collections</FormLabel>
              <FormControl>
                  <CollectionSelector name={field.field.name} label="Sélectionner des collections" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TemplateContainer>
    </div>
  );
}
