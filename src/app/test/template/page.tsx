import path from "path";
import fs from "node:fs";
import {notFound} from "next/navigation";
export const dynamic = 'force-dynamic';

export default async function TemplatePage() {
    const templateId = "test-template"

    const templatePath = `src/components/templates/${templateId}/settings.tsx`;
    const templateImportPath = `@/components/templates/${templateId}/settings`;

    const filepath = path.resolve(process.cwd(), templatePath);
    const templateExists = fs.existsSync(filepath);

    if (!templateExists) {
        console.log("Template not found:", templateId);
        notFound();
    }

    const template = await import(templateImportPath);

    const Settings = template.default || template;

    return <Settings />
}