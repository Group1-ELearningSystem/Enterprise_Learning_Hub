import nodemailer from "nodemailer";

const canSendMail = () => {
  return Boolean(process.env.MAIL_HOST && process.env.MAIL_USER && process.env.MAIL_PASS);
};

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
};

export const sendMailSafe = async ({ to, subject, html }) => {
  if (!canSendMail()) {
    console.log("[MAIL SKIPPED]", { to, subject });
    return { skipped: true };
  }

  const transporter = createTransporter();
  await transporter.sendMail({
    from: `${process.env.MAIL_FROM_NAME || "E-Learning System"} <${process.env.MAIL_USER}>`,
    to,
    subject,
    html
  });

  return { skipped: false };
};
