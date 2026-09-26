import { Resend } from 'resend';
import { config } from '../config/config';
import { logger } from './logger';

const resend = new Resend(process.env.RESEND_API_KEY);

const getFrontendUrl = (): string => {
  if (Array.isArray(config.frontendUrl)) {
    return config.frontendUrl[0] || 'http://localhost:3001';
  }
  return (config.frontendUrl as string) || 'http://localhost:3001';
};

const FROM = process.env.FROM_EMAIL || 'noreply@dewantrade.com';
const FROM_DISPLAY = `Dewan Traders <${FROM}>`;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'dewantraderssargodha@gmail.com';

// ─── Helper ──────────────────────────────────────────────────────────────────
async function send(to: string | string[], subject: string, html: string) {
  const { error } = await resend.emails.send({
    from: FROM_DISPLAY,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  });
  if (error) throw error;
}

function formatOrderCurrency(amount: number | string | any, notes?: string | null): { formatted: string; code: string; isUsd: boolean } {
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount || 0)) || 0;
  let isUsd = false;
  if (notes) {
    const u = String(notes).toUpperCase();
    if (
      u.includes('MARKET: INTERNATIONAL') ||
      u.includes('USD') ||
      u.includes('EXPORT CONTAINER') ||
      u.includes('INCOTERM') ||
      u.includes('GLOBAL')
    ) {
      isUsd = true;
    }
  }

  if (isUsd) {
    return {
      formatted: `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      code: 'USD',
      isUsd: true,
    };
  }
  return {
    formatted: `PKR ${Math.round(num).toLocaleString('en-US')}`,
    code: 'PKR',
    isUsd: false,
  };
}

// ─── Email Templates ─────────────────────────────────────────────────────────
export const mailer = {
  async sendVerificationEmail(to: string, name: string, token: string) {
    try {
      const frontendBaseUrl = getFrontendUrl();
      const verifyUrl = `${frontendBaseUrl}/auth/verify-email?token=${token}`;
      await send(to, 'Verify your email address — Dewan Traders', `
        <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
          <h2 style="color:#0284c7;margin-bottom:8px">Verify your email address</h2>
          <p style="color:#475569;font-size:14px;line-height:1.6">
            Hi <strong>${name}</strong>, thank you for signing up at <strong>Dewan Traders</strong>. Please verify your email to access your B2B dashboard.
          </p>
          <div style="margin:24px 0">
            <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#0284c7,#0ea5e9);color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">
              Verify Email Address
            </a>
          </div>
          <p style="color:#64748b;font-size:12px;line-height:1.5">
            Or copy and paste this link in your browser:<br/>
            <a href="${verifyUrl}" style="color:#0284c7;word-break:break-all">${verifyUrl}</a>
          </p>
          <p style="color:#94a3b8;font-size:11px;margin-top:24px">Dewan Traders — Sargodha, Punjab, Pakistan</p>
        </div>`);
      logger.info(`Verification email sent to ${to}`);
    } catch (err) {
      logger.error(`Failed to send verification email to ${to}: ${err}`);
    }
  },

  async sendWelcome(to: string, name: string) {
    try {
      const frontendBaseUrl = getFrontendUrl();
      await send(to, 'Welcome to Dewan Traders', `
        <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
          <h2 style="color:#0284c7;margin-bottom:8px">Welcome, ${name}!</h2>
          <p style="color:#475569;font-size:14px;line-height:1.6">
            Your buyer account on <strong>Dewan Traders</strong> is ready. You can now browse our export catalog,
            request bulk quotations, and track your shipments from your personal dashboard.
          </p>
          <a href="${frontendBaseUrl}/user" style="display:inline-block;margin-top:20px;padding:12px 24px;background:linear-gradient(135deg,#0284c7,#0ea5e9);color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">
            Go to My Dashboard
          </a>
          <p style="color:#94a3b8;font-size:11px;margin-top:24px">Dewan Traders — Sargodha, Punjab, Pakistan</p>
        </div>`);
      logger.info(`Welcome email sent to ${to}`);
    } catch (err) {
      logger.error(`Failed to send welcome email to ${to}: ${err}`);
    }
  },

  async sendOrderConfirmation(
    toOrData: any,
    nameArg?: string,
    orderNumberArg?: string,
    totalArg?: string | number,
    itemsArg?: any[],
    paymentMethodArg?: string,
    paymentAccountsArg?: any[]
  ) {
    try {
      const isObj = typeof toOrData === 'object' && toOrData !== null;
      const to = isObj ? toOrData.to : toOrData;
      const name = isObj ? toOrData.name : nameArg;
      const orderNumber = isObj ? toOrData.orderNumber : orderNumberArg;
      const items = (isObj ? toOrData.items : itemsArg) || [];
      const paymentMethod = isObj ? toOrData.paymentMethod : paymentMethodArg;
      const paymentAccounts = (isObj ? toOrData.paymentAccounts : paymentAccountsArg) || [];
      const notes = isObj ? toOrData.notes : '';
      const shippingAddress = isObj ? toOrData.shippingAddress : '';

      const totalNum = isObj && toOrData.total !== undefined ? Number(toOrData.total) : Number(totalArg);
      const subtotalNum = isObj && toOrData.subtotal !== undefined
        ? Number(toOrData.subtotal)
        : items.reduce((sum: number, it: any) => sum + (Number(it.total) || 0), 0);
      const shippingCostNum = isObj && toOrData.shippingCost !== undefined
        ? Number(toOrData.shippingCost)
        : Math.max(0, totalNum - subtotalNum);

      const currencyInfo = formatOrderCurrency(totalNum, notes);
      const subtotalFormatted = formatOrderCurrency(subtotalNum, notes).formatted;
      const shippingCostFormatted = shippingCostNum > 0
        ? formatOrderCurrency(shippingCostNum, notes).formatted
        : 'FREE / Standard';
      const grandTotalFormatted = currencyInfo.formatted;

      const itemsHtml = items.map((i: any) => {
        const itemQty = i.quantity || 1;
        const itemUnit = i.product?.unit || 'unit';
        const itemTotalNum = Number(i.total) || 0;
        const itemUnitPriceNum = i.unitPrice !== undefined ? Number(i.unitPrice) : (itemTotalNum / itemQty);
        const unitPriceFormatted = formatOrderCurrency(itemUnitPriceNum, notes).formatted;
        const totalFormatted = formatOrderCurrency(itemTotalNum, notes).formatted;

        return `<tr>
          <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#1e293b">
            <strong>${i.product?.name || 'Wholesale Commodity'}</strong>
            ${i.notes ? `<div style="font-size:11px;color:#64748b;margin-top:2px">${i.notes}</div>` : ''}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;text-align:right;color:#475569">${unitPriceFormatted} / ${itemUnit}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;text-align:center;color:#1e293b">${itemQty} ${itemUnit}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;text-align:right;font-weight:bold;color:#0f172a">${totalFormatted}</td>
        </tr>`;
      }).join('');

      const methodLabel = paymentMethod === 'bank_transfer'
        ? (currencyInfo.isUsd ? 'International Bank Wire (T/T)' : 'Local Bank Transfer')
        : paymentMethod === 'easypaisa'
        ? 'EasyPaisa Mobile Wallet'
        : paymentMethod === 'jazzcash'
        ? 'JazzCash Mobile Wallet'
        : (paymentMethod || 'Bank Wire');

      const filteredAccounts = paymentAccounts.filter((acc: any) => acc.type === (paymentMethod === 'bank_transfer' ? 'bank' : paymentMethod));

      let paymentInstructionHtml = '';
      if (filteredAccounts.length > 0) {
        paymentInstructionHtml = filteredAccounts.map((acc: any) => {
          if (acc.type === 'bank') {
            return `
              <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:8px;margin-top:12px">
                <strong style="color:#0f172a;font-size:14px">${acc.bankName}</strong><br/>
                <span style="font-size:13px;color:#475569;line-height:1.6">
                  Account Title: <strong>${acc.accountTitle}</strong><br/>
                  Account Number: <strong>${acc.accountNumber}</strong><br/>
                  IBAN: <strong>${acc.iban || 'N/A'}</strong><br/>
                  Branch / SWIFT: <strong>${acc.branch || 'N/A'}</strong>
                </span>
              </div>`;
          } else {
            return `
              <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:16px;border-radius:8px;margin-top:12px">
                <strong style="color:#0f172a;font-size:14px;text-transform:capitalize">${acc.type} Transfer</strong><br/>
                <span style="font-size:13px;color:#475569;line-height:1.6">
                  Account Title: <strong>${acc.accountTitle}</strong><br/>
                  Number: <strong>${acc.accountNumber}</strong>
                </span>
              </div>`;
          }
        }).join('');
      } else {
        paymentInstructionHtml = `<p style="font-size:13px;color:#475569">Please check your user dashboard to view active corporate payment account details.</p>`;
      }

      await send(to, `Order Placed — ${orderNumber} | Dewan Traders`, `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
          <div style="border-bottom:2px solid #0284c7;padding-bottom:16px;margin-bottom:20px">
            <h2 style="color:#0284c7;margin:0 0 6px 0;font-size:20px">Order Placed Successfully</h2>
            <div style="color:#64748b;font-size:12px">Reference: <strong style="color:#0f172a">${orderNumber}</strong> | Status: <strong style="color:#d97706">Pending Payment</strong></div>
          </div>
          <p style="color:#475569;font-size:14px;line-height:1.5">Hi <strong>${name}</strong>, thank you for choosing Dewan Traders. Here is the full financial breakdown of your order.</p>

          <table style="width:100%;border-collapse:collapse;margin:20px 0;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
            <thead><tr style="background:#f8fafc;border-bottom:1px solid #e2e8f0">
              <th style="padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;color:#64748b">Item</th>
              <th style="padding:10px 12px;text-align:right;font-size:11px;text-transform:uppercase;color:#64748b">Unit Price</th>
              <th style="padding:10px 12px;text-align:center;font-size:11px;text-transform:uppercase;color:#64748b">Qty</th>
              <th style="padding:10px 12px;text-align:right;font-size:11px;text-transform:uppercase;color:#64748b">Total</th>
            </tr></thead>
            <tbody>${itemsHtml}</tbody>
            <tfoot>
              <tr style="background:#f8fafc;border-top:1px solid #e2e8f0">
                <td colspan="3" style="padding:8px 12px;font-size:13px;color:#475569">Commodity Subtotal:</td>
                <td style="padding:8px 12px;font-size:13px;color:#1e293b;text-align:right;font-weight:bold">${subtotalFormatted}</td>
              </tr>
              <tr style="background:#f8fafc">
                <td colspan="3" style="padding:8px 12px;font-size:13px;color:#475569">Shipping / Freight &amp; Logistics:</td>
                <td style="padding:8px 12px;font-size:13px;color:#1e293b;text-align:right;font-weight:bold">${shippingCostFormatted}</td>
              </tr>
              <tr style="background:#eff6ff;border-top:2px solid #0284c7">
                <td colspan="3" style="padding:12px;font-weight:bold;font-size:14px;color:#0f172a">Exact Grand Total:</td>
                <td style="padding:12px;font-weight:bold;font-size:16px;color:#0284c7;text-align:right">${grandTotalFormatted} ${currencyInfo.code}</td>
              </tr>
            </tfoot>
          </table>

          ${shippingAddress ? `
          <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:12px 16px;border-radius:8px;margin:16px 0;font-size:12px;color:#475569">
            <strong style="color:#0f172a;text-transform:uppercase;font-size:10px;letter-spacing:0.5px;display:block;margin-bottom:4px">Delivery / Transit Destination</strong>
            ${shippingAddress}
          </div>` : ''}

          <h3 style="color:#0f172a;margin-top:24px;font-size:14px">Selected Payment Method: ${methodLabel}</h3>
          <p style="color:#475569;font-size:13px;line-height:1.5">Please transfer the exact amount of <strong>${grandTotalFormatted} ${currencyInfo.code}</strong> to the account below and upload a payment receipt screenshot in your user dashboard.</p>
          ${paymentInstructionHtml}

          <p style="color:#475569;font-size:13px;margin-top:20px">Our export desk will verify the payment and contact you through Email or WhatsApp for shipment dispatch.</p>
          <a href="${getFrontendUrl()}/user" style="display:inline-block;margin-top:14px;padding:12px 24px;background:linear-gradient(135deg,#0284c7,#0ea5e9);color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">
            Upload Payment Receipt Screenshot
          </a>
          <p style="color:#94a3b8;font-size:11px;margin-top:24px">Dewan Traders — Sargodha, Punjab, Pakistan</p>
        </div>`);
      logger.info(`Order confirmation email sent to ${to} for ${orderNumber} (${grandTotalFormatted})`);
    } catch (err) {
      logger.error(`Failed to send order confirmation: ${err}`);
    }
  },

  async notifyAdminNewOrder(data: any) {
    try {
      const notes = data.notes || '';
      const currencyInfo = formatOrderCurrency(data.total, notes);
      const totalFormatted = currencyInfo.formatted;
      const subtotalFormatted = data.subtotal ? formatOrderCurrency(data.subtotal, notes).formatted : totalFormatted;
      const shippingFormatted = data.shippingCost !== undefined ? formatOrderCurrency(data.shippingCost, notes).formatted : 'N/A';

      await send(ADMIN_EMAIL, `New Order Placed — ${data.orderNumber} (${totalFormatted} ${currencyInfo.code})`, `
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
            <tr><td style="padding:6px 0;font-weight:bold">Subtotal:</td><td>${subtotalFormatted}</td></tr>
            <tr><td style="padding:6px 0;font-weight:bold">Shipping/Logistics:</td><td>${shippingFormatted}</td></tr>
            <tr><td style="padding:6px 0;font-weight:bold">Exact Value:</td><td style="color:#e11d48;font-weight:bold;font-size:14px">${totalFormatted} ${currencyInfo.code}</td></tr>
            <tr><td style="padding:6px 0;font-weight:bold">Payment Method:</td><td style="text-transform:capitalize">${data.paymentMethod}</td></tr>
          </table>
          <a href="${getFrontendUrl()}/admin/orders/${data.id}" style="display:inline-block;padding:12px 24px;background:#e11d48;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">
            Open Order Details Page
          </a>
        </div>`);
      logger.info(`Admin notification email sent for order ${data.orderNumber}`);
    } catch (err) {
      logger.error(`Failed to send admin order notification: ${err}`);
    }
  },

  async notifyAdminPaymentProof(data: any) {
    try {
      await send(ADMIN_EMAIL, `Payment Proof Uploaded — ${data.orderNumber}`, `
        <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
          <h2 style="color:#0d9488">Payment Receipt Submitted</h2>
          <p style="color:#475569;font-size:14px">Customer <strong>${data.customerName}</strong> uploaded a payment screenshot for order <strong>${data.orderNumber}</strong>.</p>
          <p style="color:#475569;font-size:14px">Please review the proof details page to approve or reject the payment credentials.</p>
          <a href="${getFrontendUrl()}/admin/orders/${data.orderId}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#0d9488;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">
            Verify Payment Screenshot
          </a>
        </div>`);
      logger.info(`Admin notification email sent for payment proof on order ${data.orderNumber}`);
    } catch (err) {
      logger.error(`Failed to send admin payment proof notification: ${err}`);
    }
  },

  async sendPaymentVerified(to: string, name: string, orderNumber: string) {
    try {
      await send(to, `Payment Approved — ${orderNumber} | Dewan Traders`, `
        <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
          <h2 style="color:#10b981">Payment Verified Successfully</h2>
          <p style="color:#475569;font-size:14px">Hi ${name}, your payment for order <strong>${orderNumber}</strong> has been approved.</p>
          <p style="color:#475569;font-size:14px">Your order is now being processed and cleared for dispatch.</p>
          <a href="${getFrontendUrl()}/user" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#10b981;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">
            View Order Timeline
          </a>
          <p style="color:#94a3b8;font-size:11px;margin-top:24px">Dewan Traders — Sargodha, Punjab, Pakistan</p>
        </div>`);
    } catch (err) {
      logger.error(`Failed to send payment verified email to ${to}: ${err}`);
    }
  },

  async sendPaymentRejected(to: string, name: string, orderNumber: string, reason: string) {
    try {
      await send(to, `Payment Declined — ${orderNumber} | Dewan Traders`, `
        <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
          <h2 style="color:#ef4444">Payment Verification Failed</h2>
          <p style="color:#475569;font-size:14px">Hi ${name}, the payment receipt uploaded for order <strong>${orderNumber}</strong> was declined.</p>
          <div style="background:#fef2f2;border:1px solid #fecaca;padding:16px;border-radius:8px;color:#b91c1c;font-size:13px;margin:16px 0">
            Reason: <strong>${reason}</strong>
          </div>
          <p style="color:#475569;font-size:14px">Please upload a valid bank transfer transaction screenshot or contact support.</p>
          <a href="${getFrontendUrl()}/user" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#ef4444;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">
            Upload New Receipt
          </a>
          <p style="color:#94a3b8;font-size:11px;margin-top:24px">Dewan Traders — Sargodha, Punjab, Pakistan</p>
        </div>`);
    } catch (err) {
      logger.error(`Failed to send payment rejected email to ${to}: ${err}`);
    }
  },

  async sendProcessingAlert(to: string, name: string, orderNumber: string) {
    try {
      await send(to, `Shipment Processing — ${orderNumber} | Dewan Traders`, `
        <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
          <h2 style="color:#0284c7">Processing Started</h2>
          <p style="color:#475569;font-size:14px">Hi ${name}, we have verified your payment for order <strong>${orderNumber}</strong>.</p>
          <p style="color:#475569;font-size:14px">Our warehouse team has initiated product preparation, packing, and phytosanitary clearance checks.</p>
          <p style="color:#94a3b8;font-size:11px;margin-top:24px">Dewan Traders — Sargodha, Punjab, Pakistan</p>
        </div>`);
    } catch (err) {
      logger.error(`Failed to send processing alert email: ${err}`);
    }
  },

  async sendShippedAlert(to: string, name: string, orderNumber: string, trackingNumber: string) {
    try {
      await send(to, `Shipment Dispatched — ${orderNumber} | Dewan Traders`, `
        <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
          <h2 style="color:#0d9488">Cargo Dispatched</h2>
          <p style="color:#475569;font-size:14px">Hi ${name}, your order <strong>${orderNumber}</strong> has been shipped from the loading port.</p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:16px;border-radius:8px;color:#15803d;font-size:13px;margin:16px 0">
            Tracking Reference No: <strong style="font-family:monospace">${trackingNumber}</strong>
          </div>
          <a href="${getFrontendUrl()}/track?number=${orderNumber}" style="display:inline-block;padding:12px 24px;background:#0d9488;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">
            Track Shipment Progress
          </a>
          <p style="color:#94a3b8;font-size:11px;margin-top:24px">Dewan Traders — Sargodha, Punjab, Pakistan</p>
        </div>`);
    } catch (err) {
      logger.error(`Failed to send shipped alert email: ${err}`);
    }
  },

  async sendDeliveredAlert(to: string, name: string, orderNumber: string) {
    try {
      await send(to, `Shipment Delivered — ${orderNumber} | Dewan Traders`, `
        <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
          <h2 style="color:#16a34a">Cargo Delivered</h2>
          <p style="color:#475569;font-size:14px">Hi ${name}, your wholesale shipment order <strong>${orderNumber}</strong> has been successfully delivered.</p>
          <p style="color:#475569;font-size:14px">Thank you for choosing Dewan Traders for your global commodity sourcing.</p>
          <p style="color:#94a3b8;font-size:11px;margin-top:24px">Dewan Traders — Sargodha, Punjab, Pakistan</p>
        </div>`);
    } catch (err) {
      logger.error(`Failed to send delivered alert email: ${err}`);
    }
  },

  async sendInquiryReply(to: string, name: string, subject: string, originalMessage: string, replyMessage: string, contactInfo: any) {
    try {
      const emailText = contactInfo?.email1 || 'sajjad@dewantraders.com';
      const phoneText = contactInfo?.phone1 || '+92-48-3725080';
      const whatsappText = contactInfo?.whatsapp || '+923001234567';

      await send(to, `Re: ${subject} | Dewan Traders Inquiry Response`, `
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
        </div>`);
      logger.info(`Inquiry reply email sent to ${to}`);
    } catch (err) {
      logger.error(`Failed to send inquiry reply email to ${to}: ${err}`);
    }
  },

  async sendInquiryConfirmation(to: string, name: string, subject: string) {
    try {
      await send(to, `Inquiry Received — ${subject} | Dewan Traders`, `
        <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
          <h2 style="color:#0284c7">Inquiry Received</h2>
          <p style="color:#475569;font-size:14px">Hi ${name}, we have received your inquiry about <strong>${subject}</strong>.</p>
          <p style="color:#475569;font-size:14px">Sajjad Hussain Awan and our export team will review your request and respond within <strong>24 hours</strong>.</p>
          <a href="${getFrontendUrl()}/contact" style="display:inline-block;margin-top:16px;padding:12px 24px;background:linear-gradient(135deg,#0284c7,#0ea5e9);color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">
            Visit Our Website
          </a>
          <p style="color:#94a3b8;font-size:11px;margin-top:24px">Dewan Traders — Sargodha, Punjab, Pakistan</p>
        </div>`);
      logger.info(`Inquiry confirmation sent to ${to}`);
    } catch (err) {
      logger.error(`Failed to send inquiry confirmation to ${to}: ${err}`);
    }
  },

  async notifyAdminNewInquiry(inquiry: any) {
    try {
      await send(ADMIN_EMAIL, `New Inquiry: ${inquiry.subject}`, `
        <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
          <h2 style="color:#0284c7">New Inquiry Received</h2>
          <table style="width:100%;font-size:13px;color:#475569">
            <tr><td style="padding:6px 0;font-weight:bold;width:120px">From:</td><td>${inquiry.name} (${inquiry.email})</td></tr>
            <tr><td style="padding:6px 0;font-weight:bold">Company:</td><td>${inquiry.company || 'N/A'}</td></tr>
            <tr><td style="padding:6px 0;font-weight:bold">Subject:</td><td>${inquiry.subject}</td></tr>
            <tr><td style="padding:6px 0;font-weight:bold">Product:</td><td>${inquiry.productName || 'General'}</td></tr>
            <tr><td style="padding:6px 0;font-weight:bold;vertical-align:top">Message:</td><td>${inquiry.message}</td></tr>
          </table>
          <a href="${getFrontendUrl()}/admin/inquiries" style="display:inline-block;margin-top:20px;padding:12px 24px;background:linear-gradient(135deg,#0284c7,#0ea5e9);color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">
            View in Admin Panel
          </a>
        </div>`);
    } catch (err) {
      logger.error(`Failed to notify admin of inquiry: ${err}`);
    }
  },

  async sendPasswordReset(to: string, name: string, resetToken: string) {
    const resetUrl = `${getFrontendUrl()}/auth/reset-password?token=${resetToken}`;
    try {
      await send(to, 'Reset Your Password — Dewan Traders', `
        <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
          <h2 style="color:#0284c7">Password Reset</h2>
          <p style="color:#475569;font-size:14px">Hi ${name}, a password reset was requested for your account.</p>
          <p style="color:#475569;font-size:14px">Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:linear-gradient(135deg,#0284c7,#0ea5e9);color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">
            Reset Password
          </a>
          <p style="color:#94a3b8;font-size:11px;margin-top:24px">If you didn't request this, please ignore this email.</p>
        </div>`);
      logger.info(`Password reset email sent to ${to}`);
    } catch (err) {
      logger.error(`Failed to send password reset email to ${to}: ${err}`);
    }
  },
};
