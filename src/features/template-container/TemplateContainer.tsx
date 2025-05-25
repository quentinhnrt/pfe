"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { type ReactNode, useEffect, useState } from "react"
import { type Path, useForm } from "react-hook-form"
import { type ZodObject, type ZodRawShape, z, type ZodBoolean } from "zod"
import type { UserTemplate } from "@prisma/client"
import { Loader2, Save, Eye, EyeOff, CheckCircle } from "lucide-react"

type TemplateContainerProps<TShape extends ZodRawShape> = {
    children: ReactNode
    schema: ZodObject<TShape>
    onRequest?: (
        data: z.infer<ZodObject<TShape & { active: ZodBoolean }>>,
    ) =>
        | Promise<z.infer<ZodObject<TShape & { active: ZodBoolean }>>>
        | z.infer<ZodObject<TShape & { active: ZodBoolean }>>
    templateId?: number
}

export function TemplateContainer<TShape extends ZodRawShape>({
                                                                  children,
                                                                  schema,
                                                                  templateId,
                                                              }: TemplateContainerProps<TShape>) {
    const extendedSchema = schema.extend({
        active: z.boolean().default(true),
    })

    type FormSchema = z.infer<typeof extendedSchema>

    const form = useForm<FormSchema>({
        resolver: zodResolver(extendedSchema),
        mode: "onSubmit",
    })

    const { data: session } = authClient.useSession()
    const [hasInitialData, setHasInitialData] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const router = useRouter()

    const isActive = form.watch("active" as Path<FormSchema>) as boolean

    useEffect(() => {
        if (!session || !session.user || !templateId) return

        async function setFormExistingData() {
            try {
                const userResponse = await fetch(`/api/user/${session?.user.id}/templates`)
                const templates: UserTemplate[] = await userResponse.json()
                const currentTemplate = templates.find((template) => template.templateId === templateId)

                if (currentTemplate?.data) {
                    // @ts-expect-error it works as expected
                    currentTemplate.data.active = currentTemplate.active ?? true
                    form.reset(currentTemplate.data as FormSchema)
                    setHasInitialData(true)
                }
            } catch (error) {
                console.error("Error loading template data", error)
            } finally {
                setIsLoading(false)
            }
        }

        setFormExistingData()
    }, [session, form, templateId])

    const onSubmit = async (values: FormSchema) => {
        setIsSubmitting(true)
        try {
            console.log(values)
            const payload = { ...values }
            const active = payload.active
            delete payload.active

            await fetch(`/api/templates`, {
                method: hasInitialData ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: payload,
                    templateId,
                    active,
                }),
            })

            setShowSuccess(true)
            setTimeout(() => {
                router.push("/settings/portfolio")
            }, 1500)
        } catch (error) {
            console.error("Error submitting form", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <Card className="p-8 shadow-lg border border-gray-200 bg-white">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <Loader2 className="w-8 h-8 text-gray-700 animate-spin" />
                            <div className="absolute inset-0 w-8 h-8 border-2 border-gray-300 rounded-full animate-pulse" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900">Loading Template</h3>
                            <p className="text-sm text-gray-600">Please wait while we load your settings...</p>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }

    if (showSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <Card className="p-8 shadow-lg border border-gray-200 bg-white">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                            <div className="absolute inset-0 w-12 h-12 border-2 border-gray-300 rounded-full animate-ping" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-semibold text-gray-900">Settings Saved!</h3>
                            <p className="text-sm text-gray-600">Redirecting to your portfolio...</p>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {children}

                {/* Template Status Card */}
                <Card className="shadow-lg border border-gray-200 bg-white overflow-hidden">
                    <CardContent className="p-6">
                        <FormField
                            control={form.control}
                            name={"active" as Path<FormSchema>}
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                {isActive ? (
                                                    <div className="p-2 bg-gray-100 rounded-lg">
                                                        <Eye className="w-5 h-5 text-green-600" />
                                                    </div>
                                                ) : (
                                                    <div className="p-2 bg-gray-100 rounded-lg">
                                                        <EyeOff className="w-5 h-5 text-gray-600" />
                                                    </div>
                                                )}
                                                <div>
                                                    <FormLabel className="text-lg font-semibold text-gray-900">Template Status</FormLabel>
                                                    <FormDescription className="text-sm text-gray-600 mt-1">
                                                        {isActive
                                                            ? "Your template is currently active and visible to visitors"
                                                            : "Your template is currently disabled and hidden from visitors"}
                                                    </FormDescription>
                                                </div>
                                            </div>
                                        </div>
                                        <FormControl>
                                            <div className="flex items-center space-x-3">
                        <span
                            className={`text-sm font-medium transition-colors ${
                                isActive ? "text-gray-900" : "text-gray-500"
                            }`}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>
                                                <Switch
                                                    checked={field.value as boolean}
                                                    onCheckedChange={field.onChange}
                                                    className="data-[state=checked]:bg-gray-900"
                                                />
                                            </div>
                                        </FormControl>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end pt-6">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="min-w-[140px] h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200 bg-gray-900 hover:bg-gray-800 text-white"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Save className="w-4 h-4" />
                                Save Changes
                            </div>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
