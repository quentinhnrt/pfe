'use client'
import {z} from "zod";
import {useForm} from "react-hook-form";
import {Prisma} from "@prisma/client";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {ArtworkGallerySelector} from "@/shared/components/fields/ArtworkGallerySelector";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import ArtworkForm from "@/shared/components/forms/ArtworkForm";
import {ReactNode} from "react";
import {ArtworkGallerySelectorTest} from "@/shared/components/fields/ArtworkGallerySelectorTest";

type PostWithArtworks = Prisma.PostGetPayload<{
    include: { artworks: true }
}>

type Props = {
    post?: PostWithArtworks,
    children?: ReactNode
}

export default function PostForm({post, children}: Props) {
    const initialArtworks: number[] = post ? post.artworks.map(artwork => artwork.id) : []
    const formSchema = z.object({
        content: z.string().min(1),
        artworks: z.number().array()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: post?.content ?? "",
            artworks: initialArtworks
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const response = await fetch("/api/posts", {
            method: post ? "PUT" : "POST",
            body: JSON.stringify(values)
        })

        const data = await response.json()

        if (!response.ok) {
            console.error(data)
            return;
        }

        console.log(data)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children || <Button className={"hover:cursor-pointer"}>Créer un post</Button>}
            </DialogTrigger>
            <DialogContent className="!max-w-5xl">
                <DialogHeader>
                    <DialogTitle>
                        Créer un post
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-8"}>
                        <FormField
                            control={form.control}
                            name="content"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder={"Contenu"} {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="artworks"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Oeuvres</FormLabel>
                                    <FormControl>
                                        <ArtworkGallerySelectorTest name={"artworks"} label={"Sélectionner un ou plusieurs oeuvres à accompagner avec le post"}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Button type="submit">
                            {post ? "Modifier" : "Créer"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )

}