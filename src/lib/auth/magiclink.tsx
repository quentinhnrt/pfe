import {MagicLinkEmail} from "@/emails/magic-link";
import {render} from "@react-email/components";
import NodeMailer from "@/lib/mail";

export async function sendMagicLink({ email, url }: {email: string, token: string, url: string}): Promise<void> {
    const emailContent = await render(<MagicLinkEmail url={url} />);

    const nodemailer = new NodeMailer()

    await nodemailer.transporter.sendMail({
        to: email,
        from: process.env.EMAIL_SERVER_USER,
        subject: "Magic Link",
        html: emailContent,
    });
}