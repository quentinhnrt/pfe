"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArtworkGallerySelector } from "@/features/fields/ArtworkGallerySelector";
import Repeater from "@/features/fields/Repeater";
import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type PostWithArtworksQuestion = Prisma.PostGetPayload<{
  include: { artworks: true; question: { include: { answers: true } } };
}>;

type Props = {
  post?: PostWithArtworksQuestion;
  children?: ReactNode;
};

export default function PostForm({ post, children }: Props) {
  const initialArtworks: number[] = post
    ? post.artworks.map((artwork) => artwork.id)
    : [];
  const formSchema = z
    .object({
      content: z.string().min(1),
      artworks: z.number().array(),
      hasCommunityQuestion: z.boolean().optional(),
      question: z.string().optional(),
      answers: z.object({ answer: z.string() }).array().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.hasCommunityQuestion && !data.question) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La question est requise",
        });
      }
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: post?.content ?? "",
      artworks: initialArtworks,
      hasCommunityQuestion: !!post?.question,
      question: post?.question?.question ?? "",
      answers: post?.question
        ? parsedAnswersForForm(
            post.question.answers.map((answer) => answer.content)
          )
        : [],
    },
  });

  function parsedAnswersForForm(answers: string[]) {
    return answers.map((answer) => ({ answer }));
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch("/api/posts", {
      method: post ? "PUT" : "POST",
      body: JSON.stringify({
        content: values.content,
        artworks: values.artworks,
        question:
          values.hasCommunityQuestion && values.question
            ? values.question
            : null,
        answers:
          values.hasCommunityQuestion && values.answers
            ? values.answers.map((answer) => answer.answer)
            : null,
        postId: post?.id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return;
    }
  }

  const hasCommunityQuestion = form.watch("hasCommunityQuestion");

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button className={"hover:cursor-pointer"}>Créer un post</Button>
        )}
      </DialogTrigger>
      <DialogContent className="!max-w-5xl">
        <DialogHeader>
          <DialogTitle>Créer un post</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-8"}>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder={"Contenu"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="artworks"
              render={() => (
                <FormItem>
                  <FormLabel>Oeuvres</FormLabel>
                  <FormControl>
                    <ArtworkGallerySelector
                      name={"artworks"}
                      label={
                        "Sélectionner un ou plusieurs oeuvres à accompagner avec le post"
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasCommunityQuestion"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>
                      Y a t-il une question à la communauté ?
                    </FormLabel>
                  </div>
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
                      <FormLabel>Question</FormLabel>
                      <FormControl>
                        <Textarea placeholder={"Contenu"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="answers"
                  render={() => (
                    <FormItem>
                      <FormLabel>Réponses</FormLabel>
                      <FormControl>
                        <Repeater<{ answer: string }>
                          name={"answers"}
                          initialValues={{ answer: "" }}
                          renderFields={(item, index, handleChange) => (
                            <Input
                              type="text"
                              value={item.answer}
                              onChange={(e) =>
                                handleChange(index, "answer", e.target.value)
                              }
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button type="submit">{post ? "Modifier" : "Créer"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
