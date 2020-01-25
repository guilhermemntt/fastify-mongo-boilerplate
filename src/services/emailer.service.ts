import nodemailer, { Transporter } from "nodemailer";
import { Service } from "./index.service";
import fs from "fs";

interface EmailerService extends Service {
  sendMail: (
    subject: string,
    to: string,
    text?: string,
    htmlFilePath?: string,
    from?: string
  ) => Promise<void>;
}

let transporter: Transporter;

const emailerService: EmailerService = {
  init: async () => {
    try {
      transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      } as any);

      console.log("[EMAILER] Emailer service initialized.");
    } catch (error) {
      console.log("[EMAILER] Error during emailer service initialization");
      throw error;
    }
  },
  sendMail: async (subject, to, text, htmlFilePath, from) => {
    try {
      if (!transporter)
        throw new Error("[EMAILER] Emailer service not initialized yet.");
      const mailOptions = {
        from: from || process.env.EMAIL_ADDRESS,
        to,
        subject,
        text,
        html: htmlFilePath && fs.readFileSync(htmlFilePath)
      };

      return await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
          if (!error) {
            console.log(`[EMAILER] Email sent to ${to}: ${info.response}`);
            resolve();
          } else {
            reject(error);
          }
        });
      });
    } catch (error) {
      console.log(`[EMAILER] Error sending email to ${to}`);
      throw error;
    }
  }
};

export { emailerService };
