"use client";

import { CollectionSelector } from "@/components/fields/collection-selector";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { TemplateContainer } from "@/features/template-container/components/template-container";
import { FileText, FolderOpen, Layers, Type } from "lucide-react";
import { z } from "zod";

export const templateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  collections: z.array(z.number()).optional(),
});

export default function Settings({ templateId }: { templateId: number }) {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full">
              <Layers className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold">Template Example Settings</h1>
          </div>
          <p className="text-lg  max-w-2xl mx-auto">
            Configure your template example component with custom content and
            collections
          </p>
        </div>

        <TemplateContainer schema={templateSchema} templateId={templateId}>
          <div className="grid gap-8">
            {/* Content Configuration Card */}
            <Card className="shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl ">
                  <div className="p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  Content Configuration
                </CardTitle>
                <CardDescription className="text-base ">
                  Set up the main content for your template example
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base font-medium ">
                        <Type className="w-4 h-4 text-blue-600" />
                        Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your template title..."
                          {...field}
                          className="h-11 "
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base font-medium ">
                        <FileText className="w-4 h-4 text-green-600" />
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your template example..."
                          {...field}
                          className="min-h-[120px] resize-none "
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Collections Card */}
            <Card className="shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl ">
                  <div className="p-2  rounded-lg">
                    <FolderOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  Collections
                </CardTitle>
                <CardDescription className="text-base ">
                  Select which collections to display in this template
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  name="collections"
                  render={(field) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium ">
                        Available Collections
                      </FormLabel>
                      <FormControl>
                        <div className="mt-2">
                          <CollectionSelector
                            name={field.field.name}
                            label="Select collections"
                          />
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
  );
}
