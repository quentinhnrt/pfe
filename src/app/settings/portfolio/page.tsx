import { headers } from "next/headers"
import TemplateList, { type TemplateWithStatus } from "@/components/TemplateList"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default async function PortfolioSettings() {
    const response = await fetch(process.env.BETTER_AUTH_URL + "/api/templates", {
        headers: await headers(),
    })

    if (!response.ok) {
        const errorData = await response.json()
        console.error("Error fetching templates:", errorData)
        return (
            <div className="flex items-center justify-center p-4">
                <Card className="shadow-lg border border-gray-200 max-w-md w-full">
                    <CardContent className="p-8 text-center">
                        <div className="space-y-4">
                            <div className="p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Error Loading Templates</h1>
                            <p className="text-gray-600">{errorData.error || "Failed to load templates. Please try again later."}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const templates: TemplateWithStatus[] = await response.json()

    return <TemplateList templates={templates} />
}
