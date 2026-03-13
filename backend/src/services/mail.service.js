const nodemailer = require("nodemailer");

// Helper function to send email verification
async function sendEmail(email, emailVerificationToken) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationLink = `http://localhost:8080/auth/verify-email?token=${emailVerificationToken}`;

  (async () => {
    const info = await transporter.sendMail({
      from: `"LifeSync " <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Verify Your Email",
      text: `
Hi,

Please verify your email by clicking the link below:
${verificationLink}

If you didn’t create this account, you can ignore this email.
  `,
      html: `
  <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
    <h3>Verify Your Email</h3>
    <p>Please confirm your email address to continue.</p>
    
    <a href="${verificationLink}" 
      style="display: inline-block; padding: 10px 20px; 
              background-color: #4f46e5; color: #ffffff; 
              text-decoration: none; border-radius: 5px;">
      Verify Email
    </a>

    <p style="margin-top: 15px; font-size: 12px; color: #777;">
      If you didn’t create this account, just ignore this email.
    </p>
  </div>
  `,
    });
  })().catch(console.error);
}

async function sendResetPasswordEmail(email, resetToken) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `http://localhost:8080/auth/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: `"LifeSync" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Reset Your Password (Valid for 10 Minutes)",
    text: `
Hi,

You requested to reset your password.

Click the link below to reset your password:
${resetLink}

⚠ This link will expire in 10 minutes.

If you did not request a password reset, please ignore this email.
    `,
    html: `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
      <h3>Reset Your Password</h3>
      <p>You requested to reset your password.</p>

      <a href="${resetLink}"
        style="display: inline-block; padding: 12px 24px;
               background-color: #ef4444; color: #ffffff;
               text-decoration: none; border-radius: 6px;">
        Reset Password
      </a>

      <p style="margin-top: 15px; font-size: 14px;">
        ⏳ This link will expire in <strong>10 minutes</strong>.
      </p>

      <p style="margin-top: 15px; font-size: 12px; color: #777;">
        If you didn’t request this, you can safely ignore this email.
      </p>
    </div>
    `,
  });
}

async function sendOTP(email, otp) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  (async () => {
    const info = await transporter.sendMail({
      from: `"LifeSync " <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Verify Your Email",
      text: `
          Hi,
          Your One-Time Password (OTP) for verification is: ${otp}
          This OTP is valid for 10 minutes.
          If you did not request this, please ignore this email.

          Thanks,
          LifeSync Team
  `,
      html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px;">

              <h2 style="text-align: center; color: #333;">Verify Your Email</h2>

              <p>Hi,</p>

              <p>Your One-Time Password (OTP) for verification is:</p>

              <div style="text-align: center; margin: 20px 0;">
                <span style="font-size: 28px; letter-spacing: 5px; font-weight: bold; color: #4CAF50;">
                  ${otp}
                </span>
              </div>

              <p>This OTP is valid for <strong>10 minutes</strong>.</p>

              <p>If you did not request this, please ignore this email.</p>

              <p style="margin-top: 30px;">Thanks,<br/>LifeSync</p>

            </div>
          </div>
          `,
    });
  })().catch(console.error);
}

module.exports = {
  sendEmail,
  sendOTP,
  sendResetPasswordEmail,
};
