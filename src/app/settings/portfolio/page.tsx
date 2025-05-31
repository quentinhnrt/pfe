"use client";

import { Card, CardContent } from "@/components/ui/shadcn/card";
import TemplateList, {
  type TemplateWithStatus,
} from "@/features/portfolio/components/template-list";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function PortfolioSettings() {
  const [templates, setTemplates] = useState<TemplateWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations("page.settings.portfolio");
  const c = useTranslations("commons");

  async function fetchTemplates() {
    const response = await fetch("/api/templates");

    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.error || "Failed to load templates");
      setLoading(false);
      return;
    }

    const templates: TemplateWithStatus[] = await response.json();

    setTemplates(templates);
    setLoading(false);
  }

  useEffect(() => {
    fetchTemplates();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Card className="shadow-lg max-w-md w-full">
          <CardContent className="p-8 text-center">
            <p>{c("loading")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-4">
        <Card className="shadow-lg border border-gray-200 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t("error-loading-templates")}
              </h1>
              <p className="text-gray-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <TemplateList templates={templates} />;
}
