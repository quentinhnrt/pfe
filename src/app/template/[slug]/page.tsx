import {templates} from "@/lib/templates";
import {notFound, redirect} from "next/navigation";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";

export default async function TemplatePage({params}: { params: Promise<{ slug: string }> }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session || !session.user || session.user.role !== "ARTIST") {
        redirect("/")
    }

    // @ts-expect-error it works
    const {slug}: { slug: keyof typeof templates } = await params

    const Settings = templates[slug]?.settings.default

    if (!Settings) {
        notFound()
    }

    return (
        <div className={"max-w-7xl mx-auto"}>
            <div className={"w-full"}>
                <Settings/>
            </div>
        </div>
    )
}