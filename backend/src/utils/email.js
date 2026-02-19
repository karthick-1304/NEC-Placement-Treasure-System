import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async ({ to, name, otp }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'NEC Placement Treasure – Password Reset OTP',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:8px;">
        <h2 style="color:#1e40af;">NEC Placement Treasure</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Your OTP for password reset is:</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#1e40af;text-align:center;padding:16px 0;">${otp}</div>
        <p>This OTP is valid for <strong>${process.env.OTP_EXPIRES_IN} minutes</strong>.</p>
        <p>If you did not request this, please ignore this email.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
        <p style="color:#6b7280;font-size:12px;">NEC Placement Treasure &copy; ${new Date().getFullYear()}</p>
      </div>
    `,
  });
};