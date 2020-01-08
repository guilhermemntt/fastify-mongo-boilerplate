import nodemailer, { Transporter } from "nodemailer";
import { Service } from "./index.service";

interface EmailerService extends Service {
  sendMail: (
    subject: string,
    text: { title: string; body: string },
    toEmail: string
  ) => void;
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

      console.log("Emailer service initialized.");
    } catch (error) {
      throw error;
    }
  },
  sendMail: async (subject, text = { title: "", body: "" }, toEmail = "") => {
    if (!transporter) throw new Error("Emailer service not initialized yet.");
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: toEmail,
      subject: subject
      //    html: htmlEmailGenerator.generate(text.title, text.body)
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
};

export { emailerService };
