"use client"

import {TemplateContainer} from "@/features/template-container/TemplateContainer";
import {z} from "zod";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {CollectionSelector} from "@/features/fields/CollectionSelector";

export const templateSchema = z.object({
    description: z.string().optional(),
    // mail, instagram, twitter, facebook, tiktok, youtube...
    contactInfos: z.object({
        mail: z.string().optional(),
        instagram: z.string().optional(),
        twitter: z.string().optional(),
        facebook: z.string().optional(),
    }),

    collections: z.array(z.number()).optional(),
})

export default function Settings({templateId}: { templateId: number }) {

    return (
        <div>
            <h1>Settings</h1>
            <p>Settings for the Bento template</p>
            <TemplateContainer schema={templateSchema} templateId={templateId}>
                <div>
                    <h2>Informations utilisateur</h2>
                    <p>Ces informations seront affichées sur votre page de portfolio</p>

                    <FormField
                        name="description"
                        render={(field) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <textarea {...field.field} className="w-full h-32 p-2 border rounded-md"/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="contactInfos.mail"
                        render={(field) => (
                            <FormItem>
                                <FormLabel>Mail</FormLabel>
                                <FormControl>
                                    <input {...field.field} type="email" className="w-full p-2 border rounded-md"/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="contactInfos.instagram"
                        render={(field) => (
                            <FormItem>
                                <FormLabel>Instagram</FormLabel>
                                <FormControl>
                                    <input {...field.field} type="text" className="w-full p-2 border rounded-md"/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="contactInfos.twitter"
                        render={(field) => (
                            <FormItem>
                                <FormLabel>Twitter</FormLabel>
                                <FormControl>
                                    <input {...field.field} type="text" className="w-full p-2 border rounded-md"/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="contactInfos.facebook"
                        render={(field) => (
                            <FormItem>
                                <FormLabel>Facebook</FormLabel>
                                <FormControl>
                                    <input {...field.field} type="text" className="w-full p-2 border rounded-md"/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    name="collections"
                    render={(field) => (
                        <FormItem>
                            <FormLabel>Collections</FormLabel>
                            <FormControl>
                                <CollectionSelector name={field.field.name} label="Sélectionner des collections"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </TemplateContainer>
        </div>
    )
}