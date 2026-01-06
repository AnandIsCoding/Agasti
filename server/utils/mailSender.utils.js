import chalk from "chalk";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";

dotenv.config();

/**
 * @description Send transactional emails for Pluto Intero
 */
const mailSender = async (email, title, htmlBody, textBody = "") => {
  try {
    if (!email || !title || !htmlBody) {
      throw new Error("Email, title, and body are required.");
    }

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: Number(process.env.MAIL_PORT) === 465,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const messageId = `<${crypto.randomUUID()}@plutointero.com>`;

    const info = await transporter.sendMail({
      from: `"Pluto Intero Support" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,

      // IMPORTANT
      html: htmlBody,
      text: textBody || "Please view this email in a modern email client.",

      replyTo: process.env.MAIL_REPLY_TO || process.env.MAIL_USER,
      messageId,

      headers: {
        "X-Mailer": "Pluto Intero Transactional Mailer",
        "X-Priority": "3",
        "X-Entity-Ref-ID": crypto.randomUUID(),
      },
    });

    if (process.env.NODE_ENV !== "production") {
      console.log(chalk.green.bold("✅ Email sent"));
      console.log(chalk.cyan("📧 To:"), email);
      console.log(chalk.gray("🆔 Message ID:"), info.messageId);
    }

    return info;
  } catch (error) {
    console.error(
      chalk.bgRed.white("❌ MailSender Error"),
      chalk.red(error.message),
    );
    throw error;
  }
};

export default mailSender;
