import nodemailer from 'nodemailer';
import { config } from '../config/config';
import { logger } from './logger';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = `"Dewan Traders" <${process.env.SMTP_USER || 'noreply@dewantraders.com'}>`;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sajjad@dewantraders.com';

export const mailer = {
  async sendWelcome(to: string, name: string) {
    try {
      await transporter.sendMail({
        from: FROM,
        to,
        subject: 'Welcome to Dewan Traders',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
            <h2 style="color:#0284c7;margin-bottom:8px">Welcome, ${name}!</h2>
            <p style="color:#475569;font-size:14px;line-height:1.6">
              Your buyer account on <strong>Dewan Traders</strong> is ready. You can now browse our export catalog,
              request bulk quotations, and track your shipments from your personal dashboard.
            </p>
            <a href="${config.frontendUrl}/user" style="display:inline-block;margin-top:20px;padding:12px 24px;background:linear-gradient(135deg,#0284c7,#0ea5e9);color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">
              Go to My Dashboard
            </a>
            <p style="color:#94a3b8;font-size:11px;margin-top:24px">Dewan Traders — Sargodha, Punjab, Pakistan</p>
          </div>`,
      });
      logger.info(`Welcome email sent to ${to}`);
    } catch (err) {
      logger.error(`Failed to send welcome email to ${to}: ${err}`);
    }
  },

  async sendOrderConfirmation(to: string, name: string, orderNumber: string, total: string, items: any[]) {
    try {
      const itemsHtml = items.map((i: any) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px">${i.product?.name || 'Product'}</td>
         <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;text-align:center">${i.quantity} ${i.product?.unit || ''}</td>
         <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;text-align:right">PKR ${Number(i.total).toLocaleString()}</td></tr>`
      ).join('');

      await transporter.sendMail({
        from: FROM,
        to,
        subject: `Order Confirmed — ${orderNumber} | Dewan Traders`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
            <h2 style="color:#0284c7">Order Received</h2>
            <p style="color:#475569;font-size:14px">Hi ${name}, your order <strong>${orderNumber}</strong> has been received and is pending confirmation.</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
              <thead><tr style="background:#f8fafc">
                <th style="padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;color:#94a3b8">Product</th>
                <th style="padding:8px 12px;text-align:center;font-size:11px;text-transform:uppercase;color:#94a3b8">Qty</th>
                <th style="padding:8px 12px;text-align:right;font-size:11px;text-transform:uppercase;color:#94a3b8">Total</th>
              </tr></thead>
              <tbody>${itemsHtml}</tbody>
              <tfoot><tr>
                <td colspan="2" style="padding:12px;font-weight:bold;font-size:14px;color:#0f172a">Grand Total</td>
                <td style="padding:12px;font-weight:bold;font-size:14px;color:#0284c7;text-align:right">PKR ${Number(total).toLocaleString()}</td>
              </tr></tfoot>
            </table>
            <a href="${config.frontendUrl}/user" style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#0284c7,#0ea5e9);color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">
              Track Order
            </a>
            <p style="color:#94a3b8;font-size:11px;margin-top:24px">Dewan Traders — Sargodha, Punjab, Pakistan</p>
          </div>`,
      });
      logger.info(`Order confirmation sent to ${to} for ${orderNumber}`);
    } catch (err) {
      logger.error(`Failed to send order confirmation to ${to}: ${err}`);
    }
  },

  async sendInquiryConfirmation(to: string, name: string, subject: string) {
    try {
      await transporter.sendMail({
        from: FROM,
        to,
        subject: `Inquiry Received — ${subject} | Dewan Traders`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
            <h2 style="color:#0284c7">Inquiry Received</h2>
            <p style="color:#475569;font-size:14px">Hi ${name}, we have received your inquiry about <strong>${subject}</strong>.</p>
            <p style="color:#475569;font-size:14px">Sajjad Hussain Awan and our export team will review your request and respond within <strong>24 hours</strong>.</p>
            <a href="${config.frontendUrl}/contact" style="display:inline-block;margin-top:16px;padding:12px 24px;background:linear-gradient(135deg,#0284c7,#0ea5e9);color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">
              Visit Our Website
            </a>
            <p style="color:#94a3b8;font-size:11px;margin-top:24px">Dewan Traders — Sargodha, Punjab, Pakistan</p>
          </div>`,
      });
      logger.info(`Inquiry confirmation sent to ${to}`);
    } catch (err) {
      logger.error(`Failed to send inquiry confirmation to ${to}: ${err}`);
    }
  },

  async notifyAdminNewInquiry(inquiry: any) {
    try {
      await transporter.sendMail({
        from: FROM,
        to: ADMIN_EMAIL,
        subject: `New Inquiry: ${inquiry.subject}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
            <h2 style="color:#0284c7">New Inquiry Received</h2>
            <table style="width:100%;font-size:13px;color:#475569">
              <tr><td style="padding:6px 0;font-weight:bold;width:120px">From:</td><td>${inquiry.name} (${inquiry.email})</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold">Company:</td><td>${inquiry.company || 'N/A'}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold">Subject:</td><td>${inquiry.subject}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold">Product:</td><td>${inquiry.productName || 'General'}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;vertical-align:top">Message:</td><td>${inquiry.message}</td></tr>
            </table>
            <a href="${config.frontendUrl}/admin/inquiries" style="display:inline-block;margin-top:20px;padding:12px 24px;background:linear-gradient(135deg,#0284c7,#0ea5e9);color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">
              View in Admin Panel
            </a>
          </div>`,
      });
    } catch (err) {
      logger.error(`Failed to notify admin of inquiry: ${err}`);
    }
  },

  async sendPasswordReset(to: string, name: string, resetToken: string) {
    const resetUrl = `${config.frontendUrl}/auth/reset-password?token=${resetToken}`;
    try {
      await transporter.sendMail({
        from: FROM,
        to,
        subject: 'Reset Your Password — Dewan Traders',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
            <h2 style="color:#0284c7">Password Reset</h2>
            <p style="color:#475569;font-size:14px">Hi ${name}, a password reset was requested for your account.</p>
            <p style="color:#475569;font-size:14px">Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
            <a href="${resetUrl}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:linear-gradient(135deg,#0284c7,#0ea5e9);color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">
              Reset Password
            </a>
            <p style="color:#94a3b8;font-size:11px;margin-top:24px">If you didn't request this, please ignore this email.</p>
          </div>`,
      });
      logger.info(`Password reset email sent to ${to}`);
    } catch (err) {
      logger.error(`Failed to send password reset email to ${to}: ${err}`);
    }
  },
};
