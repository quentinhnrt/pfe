import {notFound} from "next/navigation";
import {templates} from "@/lib/templates";
import {getUserByUsername} from "@/lib/users";
export default async function PortfolioPage({params}: { params: Promise<{ username: string }> }) {
    const {username} = await params
    const user = await getUserByUsername(username)

    const activeTemplate = user.user_template[0]

    if (!activeTemplate) {
        console.log("No active template found for user:", username)
        notFound()
    }

    const templateId = activeTemplate.template.slug

    // @ts-expect-error it is a dynamic import
    const Template = templates[templateId]?.render.default

    if (!Template) {
        console.log("Template not found:", templateId)
        notFound()
    }

    return (
        <div>
            <h1>Portfolio</h1>
            <p>Portfolio of {username}</p>
            <p>Active template: {templateId}</p>

            <Template data={activeTemplate.data} user={user} />
        </div>
    )
}