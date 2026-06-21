import * as functions from 'firebase-functions/v1'
import * as admin from 'firebase-admin'

// Initialize Firebase Admin SDK
admin.initializeApp()

interface OrderData {
  id: string
  totalPrice: number
  gstAmount?: number
  grandTotal?: number
  products: Array<{
    name: string
    quantity: number
    discountedPrice: number
  }>
  customerInfo: {
    name: string
    mobileNo: string
    emailId: string
    address: string
    city: string
    state?: string
    pincode: string
  }
  createdAt: string
  status: string
}

interface MailPayload {
  to: string
  subject: string
  html: string
  from?: string
  replyTo?: string
}

// Cloud Function that triggers when a new order is created
export const onOrderCreated = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snapshot: functions.firestore.DocumentSnapshot, context: functions.EventContext) => {
    try {
      const orderData = snapshot.data() as OrderData
      
      if (!orderData) {
        console.log('No order data found')
        return
      }

      console.log(`New order created: ${context.params.orderId}`)

      // Get admin emails from Firestore
      const adminEmails = await getAdminEmails()

      // Generate email content
      const adminEmailContent = generateAdminEmailContent(orderData)

      // TODO: Change to Admin mail group to save costs. For now, sending to all admins
      for (const adminEmail of adminEmails) {
        await sendEmail({
          to: adminEmail,
          subject: `New Order Received - Order #${orderData.id}`,
          html: adminEmailContent,
          from: 'noreply@fireshop.com',
          replyTo: 'orders@fireshop.com'
        })
      }

      if (isValidEmail(orderData.customerInfo.emailId)) {
        const customerEmailContent = generateCustomerEmailContent(orderData)
        await sendEmail({
          to: orderData.customerInfo.emailId,
          subject: `Order Confirmation - #${orderData.id}`,
          html: customerEmailContent,
          from: 'orders@fireshop.com',
          replyTo: 'orders@fireshop.com'
        })
      } else {
        console.log(`Customer email not sent. Invalid/missing email for order ${orderData.id}`)
      }

      console.log(`Order notifications sent to ${adminEmails.length} admins`)

    } catch (error) {
      console.error('Error processing order notification:', error)
    }
  })

// Get admin emails from Firestore
async function getAdminEmails(): Promise<string[]> {
  try {
    const adminsSnapshot = await admin.firestore().collection('admins').doc('config').get()
    const adminData = adminsSnapshot.data()
    
    if (adminData?.emails && Array.isArray(adminData.emails)) {
      return adminData.emails
    }
    
    // Fallback to default admin emails
    return ['admin@fireshop.com', 'orders@fireshop.com']
  } catch (error) {
    console.error('Failed to get admin emails:', error)
    return ['admin@fireshop.com']
  }
}

function isValidEmail(email: string | undefined): boolean {
  if (!email) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(value)
}

// Generate HTML email content for admin notifications
function generateAdminEmailContent(orderData: OrderData): string {
  const formattedDate = new Date(orderData.createdAt).toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const productsTable = orderData.products.map(product => `
    <tr>
      <td style="padding: 10px; border: 1px solid #e5e7eb;">${escapeHtml(product.name)}</td>
      <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${product.quantity}</td>
      <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right;">Rs.${formatMoney(product.discountedPrice)}</td>
      <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right; font-weight: 700;">Rs.${formatMoney(product.discountedPrice * product.quantity)}</td>
    </tr>
  `).join('')

  const finalTotal = orderData.grandTotal || orderData.totalPrice

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Notification</title>
      <style>
        body { margin: 0; background: #f3f4f6; color: #111827; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; }
        .container { max-width: 680px; margin: 0 auto; padding: 24px 16px; }
        .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08); }
        .header { background: linear-gradient(135deg, #ef4444, #f59e0b); color: white; padding: 24px; }
        .title { margin: 0; font-size: 24px; }
        .subtitle { margin: 8px 0 0 0; opacity: 0.95; font-size: 14px; }
        .section { padding: 20px 24px; border-top: 1px solid #f3f4f6; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; }
        .label { color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; }
        .value { color: #111827; font-size: 14px; font-weight: 600; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th { background: #f59e0b; color: #ffffff; padding: 10px; text-align: left; font-size: 12px; }
        .total-row { font-weight: 700; background: #f9fafb; }
        .cta-wrap { text-align: center; margin-top: 18px; }
        .btn { display: inline-block; background: #111827; color: #ffffff !important; text-decoration: none; padding: 10px 16px; border-radius: 10px; font-weight: 600; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; padding: 18px 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <h1 class="title">New Order Received</h1>
            <p class="subtitle">Order #${escapeHtml(orderData.id)} | ${formattedDate}</p>
          </div>

          <div class="section">
            <div class="grid">
              <div>
                <div class="label">Order ID</div>
                <div class="value">#${escapeHtml(orderData.id)}</div>
              </div>
              <div>
                <div class="label">Status</div>
                <div class="value">${escapeHtml(orderData.status)}</div>
              </div>
              <div>
                <div class="label">Subtotal</div>
                <div class="value">Rs.${formatMoney(orderData.totalPrice)}</div>
              </div>
              <div>
                <div class="label">Final Total</div>
                <div class="value">Rs.${formatMoney(finalTotal)}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3 style="margin: 0 0 10px 0;">Customer Details</h3>
            <p style="margin: 6px 0;"><strong>Name:</strong> ${escapeHtml(orderData.customerInfo.name)}</p>
            <p style="margin: 6px 0;"><strong>Email:</strong> ${escapeHtml(orderData.customerInfo.emailId)}</p>
            <p style="margin: 6px 0;"><strong>Phone:</strong> ${escapeHtml(orderData.customerInfo.mobileNo)}</p>
            <p style="margin: 6px 0;"><strong>Address:</strong> ${escapeHtml(orderData.customerInfo.address)}, ${escapeHtml(orderData.customerInfo.city)}${orderData.customerInfo.state ? `, ${escapeHtml(orderData.customerInfo.state)}` : ''} - ${escapeHtml(orderData.customerInfo.pincode)}</p>
          </div>

          <div class="section">
            <h3 style="margin: 0 0 10px 0;">Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Line Total</th>
                </tr>
              </thead>
              <tbody>
                ${productsTable}
                <tr class="total-row">
                  <td colspan="3" style="padding: 10px; text-align: right;">Final Total</td>
                  <td style="padding: 10px; text-align: right; color: #047857;">Rs.${formatMoney(finalTotal)}</td>
                </tr>
              </tbody>
            </table>
            <div class="cta-wrap">
              <a href="mailto:${escapeHtml(orderData.customerInfo.emailId)}" class="btn">Contact Customer</a>
            </div>
          </div>

          <div class="footer">
            <p style="margin: 0;">Automated FireShop order alert.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateCustomerEmailContent(orderData: OrderData): string {
  const formattedDate = new Date(orderData.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

  const gstAmount = orderData.gstAmount || 0
  const finalTotal = orderData.grandTotal || orderData.totalPrice

  const productRows = orderData.products.map((product) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #f3f4f6;">${escapeHtml(product.name)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; text-align: center;">${product.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; text-align: right;">Rs.${formatMoney(product.discountedPrice * product.quantity)}</td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body { margin: 0; background: #f3f4f6; color: #1f2937; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; }
        .container { max-width: 680px; margin: 0 auto; padding: 24px 16px; }
        .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08); }
        .header { background: linear-gradient(135deg, #0ea5e9, #0284c7); color: #fff; padding: 26px 24px; }
        .title { margin: 0; font-size: 24px; }
        .subtitle { margin: 8px 0 0 0; font-size: 14px; opacity: 0.95; }
        .section { padding: 20px 24px; border-top: 1px solid #f3f4f6; }
        .address { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th { text-align: left; font-size: 12px; color: #475569; padding: 10px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
        .totals { margin-top: 14px; border-top: 1px dashed #cbd5e1; padding-top: 12px; }
        .totals p { margin: 6px 0; display: flex; justify-content: space-between; }
        .totals .grand { font-weight: 700; color: #0f172a; font-size: 16px; }
        .notice { background: #fffbeb; border: 1px solid #fde68a; color: #92400e; border-radius: 10px; padding: 12px; font-size: 13px; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; padding: 18px 8px 24px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <h1 class="title">Order Confirmed</h1>
            <p class="subtitle">Thanks for shopping with FireShop. Order #${escapeHtml(orderData.id)}</p>
          </div>

          <div class="section">
            <p style="margin: 0 0 8px 0;"><strong>Order Date:</strong> ${formattedDate}</p>
            <p style="margin: 0;"><strong>Status:</strong> Processing</p>
          </div>

          <div class="section">
            <h3 style="margin: 0 0 10px 0;">Delivery Address</h3>
            <div class="address">
              <p style="margin: 0 0 6px 0;"><strong>${escapeHtml(orderData.customerInfo.name)}</strong></p>
              <p style="margin: 0 0 6px 0;">${escapeHtml(orderData.customerInfo.address)}</p>
              <p style="margin: 0 0 6px 0;">${escapeHtml(orderData.customerInfo.city)}${orderData.customerInfo.state ? `, ${escapeHtml(orderData.customerInfo.state)}` : ''} - ${escapeHtml(orderData.customerInfo.pincode)}</p>
              <p style="margin: 0;">Phone: ${escapeHtml(orderData.customerInfo.mobileNo)}</p>
            </div>
          </div>

          <div class="section">
            <h3 style="margin: 0 0 10px 0;">Order Summary</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align:center;">Qty</th>
                  <th style="text-align:right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${productRows}
              </tbody>
            </table>

            <div class="totals">
              <p><span>Subtotal</span><span>Rs.${formatMoney(orderData.totalPrice)}</span></p>
              <p><span>GST</span><span>Rs.${formatMoney(gstAmount)}</span></p>
              <p class="grand"><span>Final Total</span><span>Rs.${formatMoney(finalTotal)}</span></p>
            </div>
          </div>

          <div class="section">
            <div class="notice">
              Courier charges are not included in the final total above and will be handled as per delivery location policy.
            </div>
          </div>

          <div class="footer">
            <p style="margin: 0;">Need help? Contact us at orders@fireshop.com</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

// Send email via provider if configured, otherwise queue in Firestore.
async function sendEmail(mail: MailPayload): Promise<void> {
  try {
    // Method 1: Using Firebase Admin SDK with SendGrid (if configured)
    if (process.env.SENDGRID_API_KEY) {
      const sgMail = require('@sendgrid/mail')
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)

      const msg = {
        to: mail.to,
        from: mail.from || 'noreply@fireshop.com',
        subject: mail.subject,
        html: mail.html,
        replyTo: mail.replyTo,
      }

      await sgMail.send(msg)
      console.log(`Email sent to ${mail.to} via SendGrid`)
      return
    }

    // Method 2: Using Nodemailer with Gmail (if configured)
    if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
      const nodemailer = require('nodemailer')
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      })

      const mailOptions = {
        from: mail.from || process.env.GMAIL_USER,
        to: mail.to,
        subject: mail.subject,
        html: mail.html,
        replyTo: mail.replyTo,
      }

      await transporter.sendMail(mailOptions)
      console.log(`Email sent to ${mail.to} via Gmail`)
      return
    }

    // Method 3: Save to Firestore for manual sending
    await admin.firestore().collection('email-queue').add({
      to: mail.to,
      from: mail.from || 'noreply@fireshop.com',
      replyTo: mail.replyTo || 'support@fireshop.com',
      subject: mail.subject,
      html: mail.html,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending',
      source: 'onOrderCreated'
    })

    console.log(`Email saved to queue for ${mail.to}`)

  } catch (error) {
    console.error(`Failed to send email to ${mail.to}:`, error)

    // Save to queue as fallback
    await admin.firestore().collection('email-queue').add({
      to: mail.to,
      from: mail.from || 'noreply@fireshop.com',
      replyTo: mail.replyTo || 'support@fireshop.com',
      subject: mail.subject,
      html: mail.html,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'failed',
      error: error instanceof Error ? error.message : String(error),
      source: 'onOrderCreated'
    })
  }
}
