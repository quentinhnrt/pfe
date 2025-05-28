import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/shadcn/dialog";
import { Button } from "@/components/ui/shadcn/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/shadcn/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { ArtworkGallerySelector } from "@/features/artwork/ArtworkGallerySelector";
import { Input } from "@/components/ui/shadcn/input";
import { useState } from "react";
import { Loader2, X } from "lucide-react";

type Props = {
    children?: React.ReactNode;
    collectionId?: number;
    onCollectionCreated?: () => void;
}

export default function CollectionForm({ children, onCollectionCreated }: Props) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const formSchema = z.object({
        title: z.string().min(1, { message: "Le titre est requis" }),
        description: z.string().optional(),
        artworks: z.number().array().min(1, { message: "Sélectionnez au moins une œuvre" }),
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
                body: JSON.stringify(values)
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

            window.location.reload()
        } catch (error) {
            console.error("Erreur lors de la création de la collection:", error);
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
                        Créer une collection
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="!max-w-5xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">
                <DialogHeader className=" pb-4 flex-shrink-0">
                    <DialogTitle className=" text-2xl font-bold flex items-center">
                        Créer une collection
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
                                            Titre de la collection
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="Donnez un nom à votre collection" 
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
                                            Description (optionnelle)
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Décrivez votre collection, son thème ou son inspiration..." 
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
                                            Œuvres à inclure
                                        </FormLabel>
                                        <FormControl>
                                            <div className=" transition-colors duration-200 rounded-lg p-4 ">
                                                <ArtworkGallerySelector
                                                    name="artworks"
                                                    label="Sélectionner un ou plusieurs œuvres à ajouter à la collection"
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
                            Annuler
                        </Button>
                        <Button
                            onClick={form.handleSubmit(onSubmit)}
                            disabled={isLoading}
                            className="transition-all duration-200 font-medium px-8 py-2 text-base min-w-[140px]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Création...
                                </>
                            ) : (
                                <>
                                    Créer
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}