"use client"

import {TemplateContainer} from "@/features/template-container/TemplateContainer";
import {z} from "zod";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {CollectionSelector} from "@/features/fields/CollectionSelector";

export const templateSchema = z.object({
    collections: z.array(z.number()).optional(),
})

export default function Settings({templateId}: { templateId: number }) {

    return (
        <div>
            <h1>Settings</h1>
            <p>Settings for the Bento template</p>
            <TemplateContainer schema={templateSchema} templateId={templateId}>
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
    )
}