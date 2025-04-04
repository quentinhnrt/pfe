import { MagicLinkEmail } from "@/shared/emails/magic-link";
import NodeMailer from "@/shared/lib/mail";
import { render } from "@react-email/components";

export async function sendMagicLink({
  email,
  url,
}: {
  email: string;
  token: string;
  url: string;
}): Promise<void> {
  const emailContent = await render(<MagicLinkEmail url={url} />);

  const nodemailer = new NodeMailer();

  await nodemailer.transporter.sendMail({
    to: email,
    from: process.env.EMAIL_SERVER_USER,
    subject: "Magic Link",
    html: emailContent,
  });
}
