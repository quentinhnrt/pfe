"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { useFormContext, Controller } from "react-hook-form"

interface ImageUploadFieldProps {
    name: string
    label?: string
    existingImage?: string
}

export function ImageUploadField({ name, label = "Image", existingImage }: ImageUploadFieldProps) {
    const { control, setValue, watch } = useFormContext()
    const file = watch(name)
    const [preview, setPreview] = useState<string | null>(null)

    useEffect(() => {
        if (file && file instanceof File) {
            const reader = new FileReader()
            reader.onloadend = () => setPreview(reader.result as string)
            reader.readAsDataURL(file)
        } else {
            setPreview(null)
        }
    }, [file])

    return (
        <Controller
            name={name}
            control={control}
            render={() => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const selectedFile = e.target.files?.[0]
                                if (selectedFile) {
                                    setValue(name, selectedFile)
                                }
                            }}
                        />
                    </FormControl>
                    <FormMessage />

                    {preview && (
                        <Card className="w-48 h-48 mt-4 overflow-hidden rounded-2xl shadow">
                            <Image
                                src={preview}
                                alt="Preview"
                                width={192}
                                height={192}
                                className="object-cover w-full h-full"
                            />
                        </Card>
                    )}

                    {!preview && existingImage && (
                        <Card className="w-48 h-48 mt-4 overflow-hidden rounded-2xl shadow">
                            <Image
                                src={existingImage}
                                alt="Preview"
                                width={192}
                                height={192}
                                className="object-cover w-full h-full"
                            />
                        </Card>
                    )}
                </FormItem>
            )}
        />
    )
}
