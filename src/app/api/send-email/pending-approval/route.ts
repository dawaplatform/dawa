export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { user_name, user_email, item_name } = await req.json();

  if (!user_email || !user_name || !item_name) {
    return NextResponse.json({ success: false, error: 'Missing required fields.' }, { status: 400 });
  }

  // Set up transporter with TLS (port 587)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use TLS
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const logoCid = 'dawa-logo@cid';
  const logoPath = `${process.cwd()}/public/assets/icons/Logo_1.png`;

  // --- Email to User ---
  const userSubject = `Your Item "${item_name}" is Pending Approval`;
  const userHtmlContent = `
    <div style="font-family: 'Lexend', 'Noto Sans', Arial, sans-serif; color: #1c140d;">
      <img src="cid:${logoCid}" alt="Dawa Platform Logo" style="height:60px; margin-bottom: 16px;" />
      <h2>Your submission is under review</h2>
      <p>Dear ${user_name},</p>
      <p>Thank you for posting your item, <strong>${item_name}</strong>, on the Dawa Platform. It is currently pending review by our team to ensure it meets our community guidelines.</p>
      <p>You will receive another email notification once the review is complete.</p>
      <p style="margin-top: 24px;">Best regards,<br/>The Dawa Platform Team</p>
    </div>
  `;

  const userMailOptions = {
    from: `"Dawa Platform" <${process.env.EMAIL}>`,
    to: user_email,
    subject: userSubject,
    html: userHtmlContent,
    attachments: [
      {
        filename: 'Logo_1.png',
        path: logoPath,
        cid: logoCid,
      },
    ],
  };

  // --- Email to Admin ---
  const adminSubject = `New Item for Approval: "${item_name}"`;
  const adminHtmlContent = `
    <div style="font-family: 'Lexend', 'Noto Sans', Arial, sans-serif; color: #1c140d;">
        <img src="cid:${logoCid}" alt="Dawa Platform Logo" style="height:60px; margin-bottom: 16px;" />
        <h2>New Item Submission</h2>
        <p>A new item has been submitted and is awaiting your approval.</p>
        <p><strong>Item Name:</strong> ${item_name}</p>
        <p><strong>Submitted by:</strong> ${user_name} (${user_email})</p>
        <p>Please log in to the admin dashboard to review and approve the item.</p>
    </div>
  `;

  const adminMailOptions = {
    from: `"Dawa Platform Notifier" <${process.env.EMAIL}>`,
    to: process.env.EMAIL, // Admin's email
    subject: adminSubject,
    html: adminHtmlContent,
    attachments: [
      {
        filename: 'Logo_1.png',
        path: logoPath,
        cid: logoCid,
      },
    ],
  };

  try {
    // Send both emails
    await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending pending approval emails:', error);
    return NextResponse.json({ success: false, error: 'Failed to send pending approval emails.' }, { status: 500 });
  }
}
