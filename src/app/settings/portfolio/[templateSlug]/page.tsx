import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { templates } from "@/lib/templates";
import {Template} from "@prisma/client";

export default async function TemplatePage({
                                               params,
                                           }: {
    params: Promise<{ slug: string }>;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user || session.user.role !== "ARTIST") {
        redirect("/");
    }

    // @ts-expect-error it works
    const { templateSlug }: { templateSlug: keyof typeof templates } = await params;

    const Settings = templates[templateSlug]?.settings.default;

    if (!Settings) {
        notFound();
    }

    const response = await fetch(process.env.BETTER_AUTH_URL + "/api/templates/" + templateSlug);

    if (response.status === 404) {
        return notFound();
    }

    const template: Template = await response.json();

    return (
        <div className={"max-w-7xl mx-auto"}>
            <div className={"w-full"}>
                <Settings templateId={template.id} />
            </div>
        </div>
    );
}
