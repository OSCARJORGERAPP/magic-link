import nodemailer from 'nodemailer';

const MAILHOG_HOST = process.env.MAILHOG_SMTP_HOST || 'localhost';
const MAILHOG_PORT = parseInt(process.env.MAILHOG_SMTP_PORT || '1025');

export async function sendMagicLinkEmail(email: string, token: string): Promise<boolean> {
  try {
    console.log(`[EMAIL] Connecting to SMTP: ${MAILHOG_HOST}:${MAILHOG_PORT}`);

    const transporter = nodemailer.createTransport({
      host: MAILHOG_HOST,
      port: MAILHOG_PORT,
      secure: false,
      ignoreTLS: true,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const magicLinkUrl = `${process.env.NEXT_PUBLIC_APP_URL}?token=${token}`;

    const mailOptions = {
      from: 'noreply@magic-link.com',
      to: email,
      subject: 'Your Magic Link - Authentication',
      html: `
        <h2>Welcome to Magic Link</h2>
        <p>Click the link below to authenticate:</p>
        <a href="${magicLinkUrl}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">
          Authenticate
        </a>
        <p>Or use this token: <code>${token}</code></p>
        <p>This link expires in 24 hours.</p>
      `,
    };

    console.log(`[EMAIL] Sending email to: ${email}`);
    const info = await transporter.sendMail(mailOptions);
    console.log('[EMAIL] Email sent successfully:', info.response);
    return true;
  } catch (error) {
    console.error('[EMAIL] Failed to send email:', error);
    return false;
  }
}
