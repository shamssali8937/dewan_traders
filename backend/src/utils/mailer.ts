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

  async sendOrderConfirmation(
    to: string,
    name: string,
    orderNumber: string,
    total: string,
    items: any[],
    paymentMethod: string,
    paymentAccounts: any[]
  ) {
    try {
      const itemsHtml = items.map((i: any) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px">${i.product?.name || 'Product'}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;text-align:center">${i.quantity} ${i.product?.unit || ''}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;text-align:right">PKR ${Number(i.total).toLocaleString()}</td>
        </tr>`
      ).join('');

      let paymentInstructionHtml = '';
      const methodLabel = paymentMethod === 'bank_transfer' ? 'Bank Transfer' : paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'JazzCash';
      
      const filteredAccounts = paymentAccounts.filter(acc => acc.type === (paymentMethod === 'bank_transfer' ? 'bank' : paymentMethod));

      if (filteredAccounts.length > 0) {
        paymentInstructionHtml = filteredAccounts.map(acc => {
          if (acc.type === 'bank') {
            return `
              <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:8px;margin-top:12px">
                <strong style="color:#0f172a;font-size:14px">${acc.bankName}</strong><br/>
                <span style="font-size:13px;color:#475569">
                  Account Title: <strong>${acc.accountTitle}</strong><br/>
                  Account Number: <strong>${acc.accountNumber}</strong><br/>
                  IBAN: <strong>${acc.iban || 'N/A'}</strong><br/>
                  Branch: <strong>${acc.branch || 'N/A'}</strong>
                </span>
              </div>`;
          } else {
            return `
              <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:8px;margin-top:12px">
                <strong style="color:#0f172a;font-size:14px;text-transform:capitalize">${acc.type} Transfer</strong><br/>
                <span style="font-size:13px;color:#475569">
                  Account Title: <strong>${acc.accountTitle}</strong><br/>
                  Number: <strong>${acc.accountNumber}</strong>
                </span>
              </div>`;
          }
        }).join('');
      } else {
        paymentInstructionHtml = `<p style="font-size:13px;color:#475569">Please check your user dashboard to view active company payment account details.</p>`;
      }

      await transporter.sendMail({
        from: FROM,
        to,
        subject: `Order Placed — ${orderNumber} | Dewan Traders`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
            <h2 style="color:#0284c7">Order Placed Successfully</h2>
            <p style="color:#475569;font-size:14px">Hi ${name}, your order <strong>${orderNumber}</strong> has been saved as <strong>Pending Payment</strong>.</p>
            
            <h3 style="color:#0f172a;margin-top:20px;font-size:15px">Selected Payment Method: ${methodLabel}</h3>
            <p style="color:#475569;font-size:13px;line-height:1.5">Please transfer the total amount to the account below and upload a payment receipt screenshot in your user dashboard.</p>
            ${paymentInstructionHtml}

            <table style="width:100%;border-collapse:collapse;margin:20px 0">
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

            <p style="color:#475569;font-size:13px">Our team will verify the payment and contact you through Email or WhatsApp for shipment confirmation.</p>
            
            <a href="${config.frontendUrl}/user" style="display:inline-block;margin-top:16px;padding:12px 24px;background:linear-gradient(135deg,#0284c7,#0ea5e9);color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">
              Upload Payment Screenshot
            </a>
            <p style="color:#94a3b8;font-size:11px;margin-top:24px">Dewan Traders — Sargodha, Punjab, Pakistan</p>
          </div>`,
      });
      logger.info(`Order confirmation email sent to ${to} for ${orderNumber}`);
    } catch (err) {
      logger.error(`Failed to send order confirmation to ${to}: ${err}`);
    }
  },

  async notifyAdminNewOrder(data: any) {
    try {
      await transporter.sendMail({
        from: FROM,
        to: ADMIN_EMAIL,
        subject: `🚨 New Order Placed — ${data.orderNumber}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
            <h2 style="color:#e11d48">New Wholesale Order Received</h2>
            <table style="width:100%;font-size:13px;color:#475569;margin-bottom:20px">
              <tr><td style="padding:6px 0;font-weight:bold;width:130px">Order Number:</td><td style="font-family:monospace;font-weight:bold">${data.orderNumber}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold">Customer Name:</td><td>${data.customerName}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold">Company Name:</td><td>${data.companyName}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold">Email:</td><td>${data.email}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold">Phone:</td><td>${data.phone}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold">Product Ordered:</td><td>${data.productName}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold">Quantity:</td><td>${data.quantity}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold">Value:</td><td>PKR ${Number(data.total).toLocaleString()}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold">Payment Method:</td><td style="text-transform:capitalize">${data.paymentMethod}</td></tr>
            </table>
            <a href="${config.frontendUrl}/admin/orders/${data.id}" style="display:inline-block;padding:12px 24px;background:#e11d48;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">
              Open Order details page
            </a>
          </div>`,
      });
      logger.info(`Admin notification email sent for order ${data.orderNumber}`);
    } catch (err) {
      logger.error(`Failed to send admin order notification: ${err}`);
    }
  },

  async notifyAdminPaymentProof(data: any) {
    try {
      await transporter.sendMail({
        from: FROM,
        to: ADMIN_EMAIL,
        subject: `💰 Payment Proof Uploaded — ${data.orderNumber}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
            <h2 style="color:#0d9488">Payment Receipt Submitted</h2>
            <p style="color:#475569;font-size:14px">Customer <strong>${data.customerName}</strong> uploaded a payment screenshot for order <strong>${data.orderNumber}</strong>.</p>
            <p style="color:#475569;font-size:14px">Please review the proof details page to approve or reject the payment credentials.</p>
            <a href="${config.frontendUrl}/admin/orders/${data.orderId}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#0d9488;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">
              Verify Payment Screenshot
            </a>
          </div>`,
      });
      logger.info(`Admin notification email sent for payment proof on order ${data.orderNumber}`);
    } catch (err) {
      logger.error(`Failed to send admin payment proof notification: ${err}`);
    }
  },

  async sendPaymentVerified(to: string, name: string, orderNumber: string) {
    try {
      await transporter.sendMail({
        from: FROM,
        to,
        subject: `✅ Payment Approved — ${orderNumber} | Dewan Traders`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
            <h2 style="color:#10b981">Payment Verified Successfully</h2>
            <p style="color:#475569;font-size:14px">Hi ${name}, your payment for order <strong>${orderNumber}</strong> has been approved.</p>
            <p style="color:#475569;font-size:14px">Your order is now being processed and cleared for dispatch.</p>
            <a href="${config.frontendUrl}/user" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#10b981;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">
              View Order Timeline
            </a>
            <p style="color:#94a3b8;font-size:11px;margin-top:24px">Dewan Traders — Sargodha, Punjab, Pakistan</p>
          </div>`,
      });
    } catch (err) {
      logger.error(`Failed to send payment verified email to ${to}: ${err}`);
    }
  },

  async sendPaymentRejected(to: string, name: string, orderNumber: string, reason: string) {
    try {
      await transporter.sendMail({
        from: FROM,
        to,
        subject: `❌ Payment Declined — ${orderNumber} | Dewan Traders`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
            <h2 style="color:#ef4444">Payment Verification Failed</h2>
            <p style="color:#475569;font-size:14px">Hi ${name}, the payment receipt uploaded for order <strong>${orderNumber}</strong> was declined.</p>
            <div style="background:#fef2f2;border:1px solid #fecaca;padding:16px;border-radius:8px;color:#b91c1c;font-size:13px;margin:16px 0">
              Reason: <strong>${reason}</strong>
            </div>
            <p style="color:#475569;font-size:14px">Please upload a valid bank transfer transaction screenshot or contact support.</p>
            <a href="${config.frontendUrl}/user" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#ef4444;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">
              Upload New Receipt
            </a>
            <p style="color:#94a3b8;font-size:11px;margin-top:24px">Dewan Traders — Sargodha, Punjab, Pakistan</p>
          </div>`,
      });
    } catch (err) {
      logger.error(`Failed to send payment rejected email to ${to}: ${err}`);
    }
  },

  async sendProcessingAlert(to: string, name: string, orderNumber: string) {
    try {
      await transporter.sendMail({
        from: FROM,
        to,
        subject: `⚙️ Shipment Processing — ${orderNumber} | Dewan Traders`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
            <h2 style="color:#0284c7">Processing Started</h2>
            <p style="color:#475569;font-size:14px">Hi ${name}, we have verified your payment for order <strong>${orderNumber}</strong>.</p>
            <p style="color:#475569;font-size:14px">Our warehouse team has initiated product preparation, packing, and phytosanitary clearance checks.</p>
            <p style="color:#94a3b8;font-size:11px;margin-top:24px">Dewan Traders — Sargodha, Punjab, Pakistan</p>
          </div>`,
      });
    } catch (err) {
      logger.error(`Failed to send processing alert email: ${err}`);
    }
  },

  async sendShippedAlert(to: string, name: string, orderNumber: string, trackingNumber: string) {
    try {
      await transporter.sendMail({
        from: FROM,
        to,
        subject: `🚢 Shipment Dispatched — ${orderNumber} | Dewan Traders`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
            <h2 style="color:#0d9488">Cargo Dispatched</h2>
            <p style="color:#475569;font-size:14px">Hi ${name}, your order <strong>${orderNumber}</strong> has been shipped from the loading port.</p>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:16px;border-radius:8px;color:#15803d;font-size:13px;margin:16px 0">
              Tracking Reference No: <strong style="font-family:monospace">${trackingNumber}</strong>
            </div>
            <a href="${config.frontendUrl}/track?number=${orderNumber}" style="display:inline-block;padding:12px 24px;background:#0d9488;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">
              Track Shipment Progress
            </a>
            <p style="color:#94a3b8;font-size:11px;margin-top:24px">Dewan Traders — Sargodha, Punjab, Pakistan</p>
          </div>`,
      });
    } catch (err) {
      logger.error(`Failed to send shipped alert email: ${err}`);
    }
  },

  async sendDeliveredAlert(to: string, name: string, orderNumber: string) {
    try {
      await transporter.sendMail({
        from: FROM,
        to,
        subject: `🎉 Shipment Delivered — ${orderNumber} | Dewan Traders`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
            <h2 style="color:#16a34a">Cargo Delivered</h2>
            <p style="color:#475569;font-size:14px">Hi ${name}, your wholesale shipment order <strong>${orderNumber}</strong> has been successfully delivered.</p>
            <p style="color:#475569;font-size:14px">Thank you for choosing Dewan Traders for your global commodity sourcing.</p>
            <p style="color:#94a3b8;font-size:11px;margin-top:24px">Dewan Traders — Sargodha, Punjab, Pakistan</p>
          </div>`,
      });
    } catch (err) {
      logger.error(`Failed to send delivered alert email: ${err}`);
    }
  },

  async sendInquiryReply(to: string, name: string, subject: string, originalMessage: string, replyMessage: string, contactInfo: any) {
    try {
      const emailText = contactInfo?.email1 || 'sajjad@dewantraders.com';
      const phoneText = contactInfo?.phone1 || '+92-48-3725080';
      const whatsappText = contactInfo?.whatsapp || '+923001234567';

      await transporter.sendMail({
        from: FROM,
        to,
        subject: `Re: ${subject} | Dewan Traders Inquiry Response`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
            <h2 style="color:#0284c7">Response to Your Sourcing Inquiry</h2>
            <p style="color:#475569;font-size:14px">Hi ${name}, Dewan Traders has replied to your B2B inquiry regarding <strong>${subject}</strong>.</p>
            
            <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:8px;margin:16px 0;font-size:13px;line-height:1.6">
              <strong style="color:#0284c7">Dewan Traders Response:</strong><br/>
              <span style="color:#0f172a">${replyMessage}</span>
            </div>

            <div style="border-left:4px solid #cbd5e1;padding-left:16px;margin:16px 0;color:#64748b;font-size:13px">
              <strong>Your original inquiry:</strong><br/>
              <em>"${originalMessage}"</em>
            </div>

            <hr style="border:0;border-top:1px solid #f1f5f9;margin:24px 0" />
            
            <h4 style="color:#0f172a;margin-bottom:8px">Contact details:</h4>
            <table style="width:100%;font-size:12px;color:#475569">
              <tr><td>WhatsApp Help:</td><td><strong>${whatsappText}</strong></td></tr>
              <tr><td>Company Email:</td><td><strong>${emailText}</strong></td></tr>
              <tr><td>Phone Number:</td><td><strong>${phoneText}</strong></td></tr>
            </table>

            <p style="color:#94a3b8;font-size:11px;margin-top:24px">Dewan Traders — Sargodha, Punjab, Pakistan</p>
          </div>`,
      });
      logger.info(`Inquiry reply email sent to ${to}`);
    } catch (err) {
      logger.error(`Failed to send inquiry reply email to ${to}: ${err}`);
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
