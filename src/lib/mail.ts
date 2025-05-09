import nodemailer from "nodemailer";
export default class NodeMailer {
  private nodemailerTransporter;
  constructor() {
    this.nodemailerTransporter = nodemailer.createTransport({
      // @ts-expect-error host exists
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      dkim: {
        domainName: process.env.EMAIL_DKIM_DOMAIN,
        keySelector: process.env.EMAIL_DKIM_KEY_SELECTOR,
        privateKey: process.env.EMAIL_DKIM_PRIVATE_KEY,
      },
    });
  }

  get transporter() {
    return this.nodemailerTransporter;
  }
}
