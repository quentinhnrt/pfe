import { notFound } from "next/navigation";

import { generatePortfolioMetadata } from "@/features/templates/bento-template/lib/generate-metadata";
import { templateSchema } from "@/features/templates/bento-template/settings";
import { templates } from "@/lib/templates";
import { getUserByUsername } from "@/lib/users";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  const { username } = await params;
  const user = await getUserByUsername(username);
  const t = await getTranslations("page.portfolio");

  const activeTemplate = user.user_template[0];

  if (!activeTemplate) {
    console.log(t("no-active-template", { username }));
    notFound();
  }

  return generatePortfolioMetadata(
    user,
    activeTemplate.data as z.infer<typeof templateSchema>
  );
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUserByUsername(username);
  const t = await getTranslations("page.portfolio");

  const activeTemplate = user.user_template[0];

  if (!activeTemplate) {
    console.log(t("no-active-template", { username }));
    notFound();
  }

  const templateId = activeTemplate.template.slug;

  // @ts-expect-error it is a dynamic import
  const Template = templates[templateId]?.render.default;

  if (!Template) {
    console.log(t("no-template-found", { templateId }));
    notFound();
  }

  return (
    <div>
      <Template data={activeTemplate.data} user={user} />
    </div>
  );
}
