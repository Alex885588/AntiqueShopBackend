import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_SENDER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendEmail(to: string, subject: string, body: string): Promise<void> {
        const mailOptions: nodemailer.SendMailOptions = {
            from: process.env.EMAIL_SENDER,
            to,
            subject,
            text: body
        };
        await this.transporter.sendMail(mailOptions);
    }
}
