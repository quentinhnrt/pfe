"use client";

import {Button} from "@/components/ui/button";
import {Form} from "@/components/ui/form";
import {authClient} from "@/lib/auth-client";
import {zodResolver} from "@hookform/resolvers/zod";
import {redirect} from "next/navigation";
import {ReactNode, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {UserTemplate} from "@prisma/client";

type TemplateContainerProps<TValues extends z.ZodTypeAny> = {
    children: ReactNode;
    schema: TValues;
    onRequest?: (
        data: z.infer<TValues>
    ) => Promise<z.infer<TValues>> | z.infer<TValues>;
    templateId?: number;
};

export function TemplateContainer<TValues extends z.ZodTypeAny>({
                                                                    children,
                                                                    schema,
                                                                    onRequest,
                                                                    templateId,
                                                                }: TemplateContainerProps<TValues>) {
    const form = useForm<z.infer<TValues>>({
        resolver: zodResolver(schema),
        mode: "onSubmit",
    });

    const {data: session} = authClient.useSession();
    const [hasInitialData, setHasInitialData] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!session || !session.user) {
            return;
        }

        const user = session?.user;

        const userId = user?.id;

        if (!userId || !templateId) {
            return;
        }

        async function setFormExistingData() {
            const userResponse = await fetch(
                "/api/user/" +
                user?.id +
                "/templates"
            );

            const templates: UserTemplate[] = await userResponse.json();
            const currentTemplate = templates.find(
                (template) => {
                    return template.templateId === templateId
                }
            )

            if (currentTemplate && currentTemplate.data) {
                const templateData = currentTemplate.data;
                form.reset(templateData);
                setHasInitialData(true);
            }

            setIsLoading(false);
        }

        setFormExistingData()
    }, [session]);

    const onSubmit = async (values: z.infer<TValues>) => {
        try {
            let payload = {...values};

            if (onRequest) {
                const modifiedPayload = await onRequest(payload);
                payload = modifiedPayload ?? payload;
            }

            const response = await fetch(`/api/templates`, {
                method: hasInitialData ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: payload,
                    templateId,
                    active: true,
                }),
            });

            const data = await response.json();

            console.log("Response", data);

            redirect(`/portfolio/${session?.user?.name}`);
        } catch (error) {
            console.error("Error submitting form", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {children}

                <Button className={"cursor-pointer"} type="submit">Enregistrer</Button>
            </form>
        </Form>
    );
}
