"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/shadcn/dialog";
import { Button } from "@/components/ui/shadcn/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { Input } from "@/components/ui/shadcn/input";
import { Switch } from "@/components/ui/shadcn/switch";
import { ArtworkGallerySelector } from "@/features/fields/ArtworkGallerySelector";
import Repeater from "@/features/fields/Repeater";
import { Loader2, X } from "lucide-react";

type Props = {
  children?: React.ReactNode;
  onPostCreated?: () => void;
};

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
        message: "La question est requise",
      });
    }
  });

export default function PostForm({ children, onPostCreated }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
          <Button className="bg-black text-white hover:bg-gray-800 border-0 transition-all duration-200 font-medium">
            Créer un post
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="!max-w-6xl max-h-[90vh] flex flex-col border-2 border-black bg-white shadow-2xl overflow-hidden">
        <DialogHeader className="border-b border-gray-200 pb-4 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-black">
            Créer un post
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
                    <FormLabel className="text-black font-semibold">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Contenu"
                        className="border-2 border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 bg-white text-black placeholder-gray-500 min-h-[100px] resize-none transition"
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
                    <FormLabel className="text-black font-semibold">
                      Œuvres
                    </FormLabel>
                    <FormControl>
                      <div className="border-2 border-gray-300 hover:border-black rounded-lg p-4 bg-gray-50 transition-colors">
                        <ArtworkGallerySelector
                          name="artworks"
                          label="Sélectionner des œuvres à accompagner"
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
                  <FormItem className="flex items-center justify-between border-2 border-gray-300 p-4 rounded-lg bg-gray-50 hover:border-black transition-colors">
                    <FormLabel className="text-black font-semibold">
                      Y a-t-il une question à la communauté ?
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-300"
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
                        <FormLabel className="text-black font-semibold">
                          Question
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Posez votre question à la communauté"
                            className="border-2 border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 bg-white text-black placeholder-gray-500 min-h-[80px] resize-none transition"
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
                        <FormLabel className="text-black font-semibold">
                          Réponses
                        </FormLabel>
                        <FormControl>
                          <div className="border-2 border-gray-300 rounded-lg p-4 bg-white space-y-2">
                            <Repeater<{ answer: string }>
                              name="answers"
                              initialValues={{ answer: "" }}
                              renderFields={(item, index, handleChange) => (
                                <Input
                                  type="text"
                                  value={item.answer}
                                  onChange={(e) =>
                                    handleChange(index, "answer", e.target.value)
                                  }
                                  placeholder={`Option ${index + 1}`}
                                  className="border-2 border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 bg-white text-black placeholder-gray-500 transition"
                                />
                              )}
                              addButtonRenderer={({ onAdd }) => (
                                <Button
                                  onClick={onAdd}
                                  variant="default"
                                  className="w-full bg-black text-white hover:bg-white hover:text-black border-black border transition-colors font-medium mt-3"
                                >
                                  Ajouter une question
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

        <div className="flex-shrink-0 border-t border-gray-200 pt-4 bg-white">
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="border-2 border-gray-300 text-black hover:bg-gray-100 hover:border-black transition font-medium"
            >
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>

            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isLoading}
              className="bg-black text-white hover:bg-gray-800 active:bg-gray-900 disabled:bg-gray-400 transition-all duration-200 font-medium px-8 py-2 text-base min-w-[140px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                <>Créer</>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
