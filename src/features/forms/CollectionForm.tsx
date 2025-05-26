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
import { Textarea } from "@/components/ui/shadcn/textarea";
import { ArtworkGallerySelector } from "@/features/fields/ArtworkGallerySelector";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  children?: React.ReactNode;
  collectionId?: number;
};

export default function CollectionForm({ children }: Props) {
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    title: z.string().min(1, { message: "Le titre est requis" }),
    description: z.string().optional(),
    artworks: z.number().array(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      artworks: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch("/api/collections", {
      method: "POST",
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (response.status !== 200) {
      console.error(data);
      return;
    }

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className={"hover:cursor-pointer"}>
            Créer une collection
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="!max-w-5xl">
        <DialogHeader>
          <DialogTitle>Créer une collection</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-4"}>
            <FormField
              control={form.control}
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
              control={form.control}
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
              control={form.control}
              name="artworks"
              render={() => (
                <FormItem>
                  <FormLabel>Oeuvres</FormLabel>
                  <FormControl>
                    <ArtworkGallerySelector
                      name={"artworks"}
                      label={
                        "Sélectionner un ou plusieurs oeuvres à ajouter à la collection"
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">{"Créer"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
