"use client"

import type { Template } from "@prisma/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Eye, EyeOff, Database, DatabaseZap, Settings, Edit, Plus, Palette } from "lucide-react"

export type TemplateWithStatus = Template & {
    user_template: {
        active: boolean
        data: object
    }[]
}

export default function TemplateList({ templates }: { templates: TemplateWithStatus[] }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <div className="p-3 bg-gray-100 rounded-full">
                            <Palette className="w-8 h-8 text-purple-600" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Portfolio Settings
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Manage your portfolio templates and customize your online presence
                    </p>
                </div>

                {templates.length > 0 ? (
                    <Card className="shadow-lg border border-gray-200 bg-white">
                        <CardHeader className="pb-6">
                            <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <Settings className="w-5 h-5 text-gray-700" />
                                </div>
                                Available Templates
                            </CardTitle>
                            <CardDescription className="text-base text-gray-600">
                                Configure and manage your portfolio templates below
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-gray-200">
                                            <TableHead className="text-gray-900 font-semibold">Template</TableHead>
                                            <TableHead className="text-gray-900 font-semibold">Description</TableHead>
                                            <TableHead className="text-gray-900 font-semibold">Status</TableHead>
                                            <TableHead className="text-gray-900 font-semibold">Data</TableHead>
                                            <TableHead className="text-right text-gray-900 font-semibold">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {templates.map((template) => {
                                            const ut = template.user_template[0]
                                            const isActive = ut?.active ?? false
                                            const hasData = ut?.data && Object.keys(ut.data).length > 0

                                            return (
                                                <TableRow key={template.id} className="border-gray-200 hover:bg-gray-50 transition-colors">
                                                    <TableCell className="font-medium text-gray-900">{template.name}</TableCell>
                                                    <TableCell className="max-w-xs truncate text-gray-600">{template.description}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={isActive ? "default" : "outline"}
                                                            className={`flex items-center gap-1.5 ${
                                                                isActive
                                                                    ? "bg-gray-900 text-white hover:bg-gray-800"
                                                                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                                                            }`}
                                                        >
                                                            {isActive ? (
                                                                <Eye className="w-3 h-3 text-green-500" />
                                                            ) : (
                                                                <EyeOff className="w-3 h-3 text-gray-500" />
                                                            )}
                                                            {isActive ? "Active" : "Inactive"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={hasData ? "default" : "outline"}
                                                            className={`flex items-center gap-1.5 ${
                                                                hasData
                                                                    ? "bg-gray-900 text-white hover:bg-gray-800"
                                                                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                                                            }`}
                                                        >
                                                            {hasData ? (
                                                                <DatabaseZap className="w-3 h-3 text-blue-500" />
                                                            ) : (
                                                                <Database className="w-3 h-3 text-gray-500" />
                                                            )}
                                                            {hasData ? "Has Data" : "Empty"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Link href={`/settings/portfolio/${template.slug}`}>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                                            >
                                                                {template.user_template[0]?.data ? (
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Edit className="w-3 h-3 text-orange-500" />
                                                                        Edit
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Plus className="w-3 h-3 text-green-500" />
                                                                        Configure
                                                                    </div>
                                                                )}
                                                            </Button>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="shadow-lg border border-gray-200 bg-white">
                        <CardContent className="p-12 text-center">
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                                    <Palette className="w-8 h-8 text-gray-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">No Templates Available</h3>
                                <p className="text-gray-600 max-w-md mx-auto">
                                    It looks like there are no portfolio templates available at the moment. Please check back later or
                                    contact support.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
