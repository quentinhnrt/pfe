import {templates} from "@/lib/templates";
import {notFound} from "next/navigation";

export default async function TemplatePage() {
    const templateId = "test-template"

    const Settings = templates[templateId]?.settings.default

    if (!Settings) {
        notFound()
    }

    return <Settings />
}