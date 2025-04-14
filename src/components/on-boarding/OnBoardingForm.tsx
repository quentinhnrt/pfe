"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Input} from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import {Button} from "../ui/button";
import {ImageUploadField} from "@/shared/components/fields/ImageUpload";
import {User} from "@prisma/client";
import {redirect} from "next/navigation";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

const formSchema = z.object({
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    role: z.enum(["ARTIST", "USER"]),
    image: z
        .any()
        .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        ),
});

export default function OnBoardingForm({user}: {user: User}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            role: "USER",
            image: null,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = new FormData()

        for (const key in values) {
            // @ts-expect-error it works
            formData.append(key, values[key])
        }

        const response = await fetch('/api/user/' + user.id, {
            method: "PUT",
            body: formData
        })

        const data = await response.json()

        if (!response.ok) {
            console.error(data.message)
            return;
        }

        redirect("/")
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="firstname"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                                <Input placeholder="Prénom" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastname"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                                <Input placeholder="Nom" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={() => (
                        <FormItem>
                            <FormLabel>Type de compte</FormLabel>
                            <FormControl>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Type de compte"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USER">Utilisateur</SelectItem>
                                        <SelectItem value="ARTIST">Artiste</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <ImageUploadField name={"image"} label={"Photo de profil"}/>
                <Button type="submit">Envoyer</Button>
            </form>
        </Form>
    );
}
