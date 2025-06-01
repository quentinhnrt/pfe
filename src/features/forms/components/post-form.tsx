"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Repeater from "@/components/fields/repeater";
import { Button } from "@/components/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/shadcn/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import { Switch } from "@/components/ui/shadcn/switch";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { ArtworkGallerySelector } from "@/features/artwork/components/artwork-gallery-selector";
import { Loader2, X } from "lucide-react";
import {useTranslations} from "next-intl";

type Props = {
  children?: React.ReactNode;
  onPostCreated?: () => void;
};


export default function PostForm({ children, onPostCreated }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const p = useTranslations("feature.post");
  const f = useTranslations("commons.forms");

  const formSchema = z
      .object({
        content: z.string().min(1),
        artworks: z.number().array(),
        hasCommunityQuestion: z.boolean().optional(),
        question: z.string().optional(),
        answers: z.array(z.object({ answer: z.string() })).optional(),
      })
      .superRefine((data, ctx) => {
        if (data.hasCommunityQuestion && !data.question) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: p("errors.question-required"),
          });
        }
      });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      artworks: [],
      hasCommunityQuestion: false,
      question: "",
      answers: [],
    },
  });

  const hasCommunityQuestion = form.watch("hasCommunityQuestion");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: values.content,
          artworks: values.artworks,
          question: values.hasCommunityQuestion ? values.question : null,
          answers: values.hasCommunityQuestion
            ? values.answers?.map((a) => a.answer)
            : null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        console.error(data);
        return;
      }
      setIsOpen(false);
      form.reset();
      onPostCreated?.();
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancel = () => {
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="border-0 transition-all duration-200 font-medium">
            Créer un post
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="!max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <DialogHeader className="pb-4 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold">
            {p("create.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 pt-4 pb-6"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">{p("labels.description")}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={p("placeholders.description")}
                        className="min-h-[100px] resize-none transition"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="artworks"
                render={() => (
                  <FormItem>
                    <FormLabel className="font-semibold">{p("labels.artworks")}</FormLabel>
                    <FormControl>
                      <div className="rounded-lg p-4 transition-colors">
                        <ArtworkGallerySelector
                          name="artworks"
                          label={p("labels.select-artworks")}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasCommunityQuestion"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between p-4 rounded-lg transition-colors border">
                    <FormLabel className="font-semibold">
                        {p("labels.has-community-question")}
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {hasCommunityQuestion && (
                <>
                  <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                            {p("labels.question")}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder={p("placeholders.question")}
                            className="min-h-[80px] resize-none transition"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 font-medium" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="answers"
                    render={() => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                            {p("labels.answers")}
                        </FormLabel>
                        <FormControl>
                          <div className="rounded-lg p-4  space-y-2">
                            <Repeater<{ answer: string }>
                              name="answers"
                              initialValues={{ answer: "" }}
                              renderFields={(item, index, handleChange) => (
                                <Input
                                  type="text"
                                  value={item.answer}
                                  onChange={(e) =>
                                    handleChange(
                                      index,
                                      "answer",
                                      e.target.value
                                    )
                                  }
                                  placeholder={`${p("labels.answers")} ${index + 1}`}
                                  className="transition"
                                />
                              )}
                              addButtonRenderer={({ onAdd }) => (
                                <Button
                                  onClick={onAdd}
                                  variant="default"
                                  className="w-full transition-colors font-medium mt-3"
                                >
                                    {p("labels.add-answer")}
                                </Button>
                              )}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-600 font-medium" />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </form>
          </Form>
        </div>

        <div className="flex-shrink-0 pt-4">
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="transition font-medium"
            >
              <X className="w-4 h-4 mr-2" />
                {f("cancel")}
            </Button>

            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isLoading}
              className="transition-all duration-200 font-medium px-8 py-2 text-base min-w-[140px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {f("creation")}
                </>
              ) : (
                <>{f("create")}</>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
