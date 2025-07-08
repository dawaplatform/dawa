export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { seller_name, seller_email, item_name, status, rejection_reason } = await req.json();

  if (!seller_email || !seller_name || !item_name || !status) {
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

  const isApproved = status === 'Approved';
  const subject = isApproved ? `Your Item "${item_name}" has been Approved!` : `Update on Your Item "${item_name}"`;
  
  const htmlContent = isApproved ? `
    <div style="font-family: 'Lexend', 'Noto Sans', Arial, sans-serif; color: #1c140d;">
      <img src="cid:${logoCid}" alt="Dawa Platform Logo" style="height:60px; margin-bottom: 16px;" />
      <h2>Congratulations! Your item is live.</h2>
      <p>Dear ${seller_name},</p>
      <p>We're excited to let you know that your item, <strong>${item_name}</strong>, has been reviewed and approved. It is now visible to buyers on the Dawa Platform.</p>
      <p>Thank you for being a part of our community!</p>
      <p style="margin-top: 24px;">Best regards,<br/>The Dawa Platform Team</p>
    </div>
  ` : `
    <div style="font-family: 'Lexend', 'Noto Sans', Arial, sans-serif; color: #1c140d;">
      <img src="cid:${logoCid}" alt="Dawa Platform Logo" style="height:60px; margin-bottom: 16px;" />
      <h2>Update on your item submission</h2>
      <p>Dear ${seller_name},</p>
      <p>Thank you for submitting your item, <strong>${item_name}</strong>, to the Dawa Platform. After careful review, we have to inform you that it could not be approved at this time.</p>
      ${rejection_reason ? `<p><strong>Reason for rejection:</strong><br/>${rejection_reason}</p>` : ''}
      <p>You can edit your listing and resubmit it for review. Please make sure it follows our community guidelines.</p>
      <p style="margin-top: 24px;">Best regards,<br/>The Dawa Platform Team</p>
    </div>
  `;

  const mailOptions = {
    from: `"Dawa Platform" <${process.env.EMAIL}>`,
    to: seller_email,
    subject: subject,
    html: htmlContent,
    attachments: [
      {
        filename: 'Logo_1.png',
        path: logoPath,
        cid: logoCid,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending item status email:', error);
    return NextResponse.json({ success: false, error: 'Failed to send item status email.' }, { status: 500 });
  }
} 