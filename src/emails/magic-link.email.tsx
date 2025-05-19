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

const baseUrl = getServerUrl();

export const MagicLinkEmail = ({ url }: { url: string }) => {
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
                alt="Artilink"
                className="mx-auto my-0"
              />
              <Text className="text-sm font-normal tracking-wider text-black uppercase">
                Artilink
              </Text>
              <Heading className="my-4 text-4xl leading-tight font-medium text-black">
                Your magic link
              </Heading>
              <Text className="mb-8 text-base leading-7 text-[#777777]">
                This link and code will only be valid for the next 5 minutes. If
                you didn&apos;t request this, please ignore this email.
              </Text>
              <Link
                href={url}
                className="inline-flex items-center rounded-lg bg-black px-10 py-3 text-center text-sm font-bold text-white no-underline"
              >
                Click here to sign in
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default MagicLinkEmail;
