import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email) {
      return Response.json({ success: false, message: "Email required" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_USER,
        pass: process.env.ZOHO_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Verify ShafaCode" <${process.env.ZOHO_USER}>`,
      to: email,
      subject: "Your Verification Code",
      html: `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #333;">Email Verification</h2>
      <p style="font-size: 16px; color: #555;">Use the OTP below to verify your email address.</p>
      <div style="font-size: 32px; font-weight: bold; margin: 20px 0; color: #1a73e8;">
        ${otp}
      </div>
      <p style="font-size: 14px; color: #999;">This code will expire in 5 minutes.</p>
      <hr style="margin: 20px 0;" />
      <p style="font-size: 12px; color: #aaa;">If you did not request this, please ignore this email.</p>
    </div>
  `,
    });

    return Response.json({
      success: true,
      message: "OTP sent successfully"
    });
  } catch (error: any) {
    console.error("Error sending OTP:", error);

    return Response.json({
      success: false,
      message:
        "Failed to send OTP. Please check your email address or try again later.",
    });
  }
}
