"use client"

import { TemplateContainer } from "@/features/template-container/TemplateContainer"
import { z } from "zod"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CollectionSelector } from "@/features/fields/CollectionSelector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {Mail, Instagram, Twitter, Facebook, SettingsIcon, FolderOpen} from "lucide-react"

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

export default function Settings({ templateId }: { templateId: number }) {
    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <div className="p-3 bg-black dark:bg-gray-100 rounded-full">
                            <SettingsIcon className="w-8 h-8 text-gray-100 dark:text-black" />
                        </div>
                        <h1 className="text-4xl font-bold">
                            Settings
                        </h1>
                    </div>
                    <p className="text-lg max-w-2xl mx-auto">
                        Customize your Bento template and configure your portfolio information
                    </p>
                </div>

                <TemplateContainer schema={templateSchema} templateId={templateId}>
                    <div className="grid gap-8">
                        {/* User Information Card */}
                        <Card className="shadow-lg">
                            <CardHeader className="pb-6">
                                <CardTitle className="flex items-center gap-3 text-2xl">
                                    <div className="p-2 rounded-lg">
                                        <Mail className="w-5 h-5 text-blue-600" />
                                    </div>
                                    User Information
                                </CardTitle>
                                <CardDescription className="text-base">
                                    This information will be displayed on your portfolio page
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    name="description"
                                    render={(field) => (
                                        <FormItem>
                                            <FormLabel className="text-base font-medium">Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field.field}
                                                    placeholder="Describe yourself in a few words..."
                                                    className="min-h-[120px] resize-none"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Separator className="" />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold ">Contact Information</h3>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <FormField
                                            name="contactInfos.mail"
                                            render={(field) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2 text-base font-medium ">
                                                        <Mail className="w-4 h-4 text-slate-600" />
                                                        Email
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field.field}
                                                            type="email"
                                                            placeholder="votre@email.com"
                                                            className="h-11 "
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            name="contactInfos.instagram"
                                            render={(field) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2 text-base font-medium ">
                                                        <Instagram className="w-4 h-4 text-pink-600" />
                                                        Instagram
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field.field}
                                                            type="url"
                                                            placeholder="https://instagram.com/your_account"
                                                            className="h-11"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            name="contactInfos.twitter"
                                            render={(field) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2 text-base font-medium ">
                                                        <Twitter className="w-4 h-4 text-blue-500" />
                                                        Twitter
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field.field}
                                                            type="url"
                                                            placeholder="https://twitter.com/your_account"
                                                            className="h-11 "
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            name="contactInfos.facebook"
                                            render={(field) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2 text-base font-medium ">
                                                        <Facebook className="w-4 h-4 text-blue-700" />
                                                        Facebook
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field.field}
                                                            type="url"
                                                            placeholder="https://facebook.com/your_profile"
                                                            className="h-11"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Collections Card */}
                        <Card className="shadow-lg">
                            <CardHeader className="pb-6">
                                <CardTitle className="flex items-center gap-3 text-2xl ">
                                    <div className="p-2 rounded-lg">
                                        <FolderOpen className="w-5 h-5 text-purple-600" />
                                    </div>
                                    Collections
                                </CardTitle>
                                <CardDescription className="text-base ">
                                    Select the collections to display in your portfolio
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    name="collections"
                                    render={(field) => (
                                        <FormItem>
                                            <FormLabel className="text-base font-medium ">Available Collections</FormLabel>
                                            <FormControl>
                                                <div className="mt-2">
                                                    <CollectionSelector name={field.field.name} label="Select collections" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TemplateContainer>
            </div>
        </div>
    )
}
