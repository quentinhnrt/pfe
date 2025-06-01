import { getServerUrl } from "@/lib/server-url";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { getTranslations } from "next-intl/server";

const baseUrl = getServerUrl();

export const MagicLinkEmail = async ({ url }: { url: string }) => {
  const e = await getTranslations("emails.magic-link");
  const a = await getTranslations("app");

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto w-full max-w-[600px] p-0">
            <Section className="p-8 text-center">
              <Img
                src={`${baseUrl}/logo.svg`}
                width={40}
                height={40}
                alt={e("alt")}
                className="mx-auto my-0"
              />
              <Text className="text-sm font-normal tracking-wider text-black uppercase">
                {a("name")}
              </Text>
              <Heading className="my-4 text-4xl leading-tight font-medium text-black">
                {e("heading")}
              </Heading>
              <Text className="mb-8 text-base leading-7 text-[#777777]">
                {e("text")}
              </Text>
              <Link
                href={url}
                className="inline-flex items-center rounded-lg bg-black px-10 py-3 text-center text-sm font-bold text-white no-underline"
              >
                {e("button")}
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default MagicLinkEmail;
