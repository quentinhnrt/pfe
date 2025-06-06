"use client";
import { ImageUploadField } from "@/components/fields/image-upload";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Artwork } from "@prisma/client";
import { CheckCircle, Euro, Loader2, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {useTranslations} from "next-intl";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

function isImageCorrect(image: File) {
  const size = image.size <= MAX_FILE_SIZE;
  const format = ACCEPTED_IMAGE_TYPES.includes(image.type);

  if (!size) {
    return {
      correct: false,
      message: "Maximum size is 5MB.",
    };
  }

  if (!format) {
    return {
      correct: false,
      message: "Only JPG, PNG, and WEBP formats are allowed.",
    };
  }

  return {
    correct: true,
    message: "",
  };
}

type Props = {
  onSuccess?: (data: Artwork) => void;
  onFailure?: (data: object) => void;
  onArtworkCreated?: () => void;
  children?: React.ReactNode;
  artwork?: Artwork | null;
};

export default function ArtworkForm({
  onSuccess,
  onFailure,
  children,
  artwork,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const c = useTranslations("commons");
  const a = useTranslations("feature.artwork");

  const formSchema = z
    .object({
      title: z
        .string()
        .min(1, a("errors.title-required"))
        .max(255, a("errors.title-too-long")),
      description: z.string().optional(),
      isForSale: z.boolean(),
      price: z.string().optional(),
      image: z.any().optional(),
      sold: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.isForSale && (!data.price || data.price.trim() === "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: a("errors.price-required"),
          path: ["price"],
        });
      }

      if (!artwork && !data.image) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: a("errors.image-required"),
          path: ["image"],
        });
      }

      if (data.image) {
        const imageCorrect = isImageCorrect(data.image);
        if (!imageCorrect.correct) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: imageCorrect.message,
            path: ["image"],
          });
        }
      }
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: artwork?.title || "",
      description: artwork?.description || "",
      isForSale: artwork?.isForSale || false,
      image: null,
      price: artwork?.price ? String(artwork.price) : "",
      sold: artwork?.sold || false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const formData = new FormData();

      for (const key in values) {
        // @ts-expect-error it works
        const value = values[key];

        if (artwork && (value === null || value === undefined)) {
          continue;
        }

        formData.append(key, value);
      }

      if (artwork) {
        formData.append("artworkId", artwork.id.toString());
      }

      const response = await fetch("/api/artworks", {
        method: artwork ? "PUT" : "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (onFailure) {
          onFailure(data);
        }
        return;
      }

      if (onSuccess) {
        onSuccess(data);
      }

      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error occured during artwork creation/update", error);
      if (onFailure) {
        onFailure({ error: c("error.title") });
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancel = () => {
    setOpen(false);
    form.reset({
      title: artwork?.title || "",
      description: artwork?.description || "",
      isForSale: artwork?.isForSale || false,
      image: null,
      price: artwork?.price ? String(artwork.price) : "",
      sold: artwork?.sold || false,
    });
  };

  const isForSale = form.watch("isForSale");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="border-0 transition-all duration-200 font-medium">
            {a("create.title")}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="!max-w-4xl max-h-[90vh]  shadow-2xl overflow-hidden flex flex-col">
        <DialogHeader className=" pb-4 flex-shrink-0">
          <DialogTitle className=" text-2xl font-bold">
            {a("create.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <Form {...form}>
            <div className="space-y-6 pt-4 pb-6">
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel className="font-semibold text-base">
                      {a("labels.image")}
                    </FormLabel>
                    <FormControl>
                      <div className="transition-colors duration-200 rounded-lg p-4 ">
                        <ImageUploadField
                          name="image"
                          label={a("labels.image")}
                          existingImage={artwork?.thumbnail || undefined}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-base">
                        {a("labels.title")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={a("placeholders.title")}
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
                        {a("labels.description")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={a("placeholders.description")}
                        {...field}
                        className="transition-all duration-200 min-h-[100px] resize-none"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 font-medium" />
                  </FormItem>
                )}
              />

              <div className="rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                    {a("labels.sales-section")}
                </h3>

                <FormField
                  control={form.control}
                  name="isForSale"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg p-4 shadow-sm  transition-colors duration-200 mb-4">
                      <div className="space-y-0.5">
                        <FormLabel className="font-semibold text-base">
                          {a("labels.is-for-sale")}
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

                {isForSale && (
                  <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black font-semibold text-base flex items-center">
                            <Euro className="w-4 h-4 mr-2" />
                            {a("labels.price")}
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                className="transition-all duration-200 pl-8"
                              />
                              <Euro className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-600 font-medium" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sold"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg p-4 shadow-sm transition-colors duration-200">
                          <div className="space-y-0.5">
                            <FormLabel className="font-semibold text-base flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                                {a("labels.sold")}
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
                  </div>
                )}
              </div>
            </div>
          </Form>
        </div>

        <div className="flex-shrink-0 pt-4">
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
                {c("forms.cancel")}
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isLoading}
              className="transition-all duration-200 font-medium px-8 py-2 text-base min-w-[140px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {artwork ? c("forms.modification") : c("forms.creation")}
                </>
              ) : (
                <p>{artwork ? c("forms.modify") : c("forms.create")}</p>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
