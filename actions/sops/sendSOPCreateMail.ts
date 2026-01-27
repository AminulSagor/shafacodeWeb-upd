"use server";

import "server-only";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_USER,
    pass: process.env.ZOHO_PASS,
  },
});

type SendMailParams = {
  to: string;
  category: string;
  userName: string;
  sopTitle: string;
};

export async function sendSOPCreateMail({
  to,
  category,
  userName,
  sopTitle,
}: SendMailParams) {
  await transporter.sendMail({
    from: `"ShafaCode SOP System" <${process.env.ZOHO_USER}>`,
    to,
    subject: `New ${category} SOP Created`,
    html: `
      <p>Hi ${userName},</p>
      <p>A new SOP has been created:</p>
      <strong>${sopTitle}</strong>
      <p>Please review it.</p>
    `,
  });
}
