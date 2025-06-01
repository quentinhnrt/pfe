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
import { ArtworkGallerySelector } from "@/features/artwork/components/artwork-gallery-selector";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {useTranslations} from "next-intl";

type Props = {
  children?: React.ReactNode;
  collectionId?: number;
  onCollectionCreated?: () => void;
};

export default function CollectionForm({
  children,
  onCollectionCreated,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const co = useTranslations("feature.collection");
  const f = useTranslations("commons.forms");
  const formSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    artworks: z
      .number()
      .array()
      .min(1, { message: co("errors.artworks-required") }),
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
    setIsLoading(true);

    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.status !== 200) {
        console.error(data);
        return;
      }

      setOpen(false);
      form.reset({
        title: "",
        description: "",
        artworks: [],
      });

      if (onCollectionCreated) {
        onCollectionCreated();
      }

      window.location.reload();
    } catch (error) {
      console.error("An error occurred during collection creation", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancel = () => {
    setOpen(false);
    form.reset({
      title: "",
      description: "",
      artworks: [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="border-0 transition-all duration-200 font-medium">
            {co("create.title")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="!max-w-5xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">
        <DialogHeader className=" pb-4 flex-shrink-0">
          <DialogTitle className=" text-2xl font-bold flex items-center">
            {co("create.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <Form {...form}>
            <div className="space-y-6 pt-4 pb-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-base">
                      {co("labels.title")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={co("placeholders.title")}
                        {...field}
                        className="transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 font-medium" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-base">
                        {co("labels.description")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={co("placeholders.description")}
                        {...field}
                        className=" transition-all duration-200 min-h-[100px] resize-none"
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
                    <FormLabel className="font-semibold text-base">
                        {co("labels.artworks")}
                    </FormLabel>
                    <FormControl>
                      <div className=" transition-colors duration-200 rounded-lg p-4 ">
                        <ArtworkGallerySelector
                          name="artworks"
                          label={co("labels.select-artworks")}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-600 font-medium" />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </div>
        <div className="flex-shrink-0  pt-4 ">
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className=" transition-all duration-200"
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
                <>
                    {f("create")}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
