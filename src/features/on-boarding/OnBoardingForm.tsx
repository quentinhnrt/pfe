"use client"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {ImageUploadField} from "@/features/fields/ImageUpload"
import {zodResolver} from "@hookform/resolvers/zod"
import type {User} from "@prisma/client"
import {redirect} from "next/navigation"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {ArrowRightIcon, UserIcon, MusicIcon} from "lucide-react"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {useState} from "react";
import {Textarea} from "@/components/ui/textarea";

const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const formSchema = z.object({
    firstname: z.string().min(1, "Le prénom est requis"),
    lastname: z.string().min(1, "Le nom est requis"),
    role: z.enum(["ARTIST", "USER"]),
    image: z
        .any()
        .refine((file) => !file || file?.size <= MAX_FILE_SIZE, `La taille maximale est de 5MB.`)
        .refine(
            (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Formats acceptés: .jpg, .jpeg, .png et .webp",
        ),
    bannerImage: z
        .any()
        .refine((file) => !file || file?.size <= MAX_FILE_SIZE, `La taille maximale est de 5MB.`)
        .refine(
            (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Formats acceptés: .jpg, .jpeg, .png et .webp",
        ),
    bio: z.string().optional(),
    website: z.string().optional(),
    location: z.string().optional(),
    username: z.string().optional(),
})

export default function OnBoardingForm({user}: { user: User }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: user.firstname ?? "",
            lastname: user.lastname ?? "",
            role: user.role ?? "USER",
            image: null,
            bannerImage: null,
            bio: user.bio ?? "",
            website: user.website ?? "",
            location: user.location ?? "",
            username: user.name ?? "",
        },
    })

    const [isLoading, setIsLoading] = useState(false)

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = new FormData()

        for (const key in values) {
            formData.append(key, values[key as keyof typeof values])
        }

        setIsLoading(true)

        const response = await fetch("/api/user/" + user.id, {
            method: "PUT",
            body: formData,
        })

        const data = await response.json()

        setIsLoading(false)

        if (!response.ok) {
            console.error(data.message)
            return
        }

        redirect("/")
    }

    const role = form.watch("role")
    const firstname = form.watch("firstname")
    const lastname = form.watch("lastname")

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Complétez votre profil</CardTitle>
                <CardDescription>Ajoutez quelques informations pour personnaliser votre expérience</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <FormField render={() => (
                                <ImageUploadField name={"image"} label={"Photo de profil"} existingImage={user.image ?? undefined}/>
                            )} name={"image"} control={form.control}/>

                        </div>
                        <div className="grid grid-cols-2 gap-6">
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
                        </div>

                        <div>
                            <FormField render={() => (
                                <ImageUploadField name={"bannerImage"} label={"Bannière"} existingImage={user.bannerImage ?? undefined}/>
                            )} name={"bannerImage"} control={form.control}/>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Nom d&apos;utilisateur</FormLabel>
                                        <FormDescription>
                                            Par défaut : {firstname.toLowerCase()}-{lastname.toLowerCase()}
                                        </FormDescription>
                                        <FormControl>
                                            <Input placeholder="Nom d'utilisateur" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Localisation</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Localisation" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div>
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Bio" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="w-full">
                            <FormField
                                control={form.control}
                                name="website"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Site web</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Site web" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="role"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Type de compte</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex gap-4"
                                            >
                                                <FormItem className="w-full">
                                                    <FormControl>
                                                        <RadioGroupItem value="USER" className="peer sr-only"
                                                                        id="role-user"/>
                                                    </FormControl>
                                                    <label
                                                        htmlFor="role-user"
                                                        className={"flex flex-col items-center justify-center gap-2 rounded-2xl border-2  p-4 cursor-pointer transition " + (role === "USER" ? "bg-primary/10 border-primary" : "border-muted")}
                                                    >
                                                        <UserIcon className="w-6 h-6"/>
                                                        <span>Utilisateur</span>
                                                    </label>
                                                </FormItem>

                                                <FormItem className="w-full">
                                                    <FormControl>
                                                        <RadioGroupItem value="ARTIST" className="peer sr-only"
                                                                        id="role-artist"/>
                                                    </FormControl>
                                                    <label
                                                        htmlFor="role-artist"
                                                        className={"flex flex-col items-center justify-center gap-2 rounded-2xl border-2  p-4 cursor-pointer transition " + (role === "ARTIST" ? "bg-primary/10 border-primary" : "border-muted")}
                                                    >
                                                        <MusicIcon className="w-6 h-6"/>
                                                        <span>Artiste</span>
                                                    </label>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <CardFooter className="px-0 pt-4">
                            <Button type="submit" className="w-full md:w-auto md:min-w-[200px] cursor-pointer">
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending...
                  </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                  <UserIcon className="h-4 w-4"/>
                                  Compléter mon profil
                                  <ArrowRightIcon className="h-4 w-4 ml-1"/>
                                </span>
                                )}

                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
