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

export async function sendSOPUpdateMail({
  to,
  category,
  userName,
  sopTitle,
}: SendMailParams) {
  await transporter.sendMail({
    from: `"SafaCode SOP System" <${process.env.ZOHO_USER}>`,
    to,
    subject: `${category} SOP Updated`,
    html: `
      <p>Hi ${userName},</p>
      <p>The following SOP has been approved and updated:</p>
      <strong>${sopTitle}</strong>
      <p>Please review it.</p>
    `,
  });
}
