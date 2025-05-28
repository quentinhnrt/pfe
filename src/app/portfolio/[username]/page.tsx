import { notFound } from "next/navigation";

import { generatePortfolioMetadata } from "@/features/templates/bento-template/lib/generate-metadata";
import { templateSchema } from "@/features/templates/bento-template/settings";
import { templates } from "@/lib/templates";
import { getUserByUsername } from "@/lib/users";
import { z } from "zod";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  const { username } = await params;
  const user = await getUserByUsername(username);

  const activeTemplate = user.user_template[0];

  if (!activeTemplate) {
    console.log("No active template found for user:", username);
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

  const activeTemplate = user.user_template[0];

  if (!activeTemplate) {
    console.log("No active template found for user:", username);
    notFound();
  }

  const templateId = activeTemplate.template.slug;

  // @ts-expect-error it is a dynamic import
  const Template = templates[templateId]?.render.default;

  if (!Template) {
    console.log("Template not found:", templateId);
    notFound();
  }

  return (
    <div>
      <Template data={activeTemplate.data} user={user} />
    </div>
  );
}
