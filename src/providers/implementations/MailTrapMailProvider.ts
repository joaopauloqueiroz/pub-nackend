import { IMailProvider, IMessage } from "@providers/IMailProvider";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export class MailtrapMailProvider implements IMailProvider {
  private transporter: Mail;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "566678e142ef8b",
        pass: "10f87fc4253554",
      },
    });
  }
  async senMail(message: IMessage): Promise<void> {
    await this.transporter.sendMail({
      to: {
        name: message.to.name,
        address: message.to.email,
      },
      from: {
        address: message.from.email,
        name: message.from.name,
      },
      subject: message.subject,
      html: message.body,
    });
  }
}
