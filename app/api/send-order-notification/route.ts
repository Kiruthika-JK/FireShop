import { NextRequest, NextResponse } from 'next/server'
import { firestore } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

interface OrderData {
  id: string
  totalPrice: number
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
    pincode: string
  }
  createdAt: string
  status: string
}

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderData = await request.json()

    if (!orderData || !orderData.id) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 })
    }

    console.log(`Sending notification for order: ${orderData.id}`)

    // Get admin emails from Firestore
    const adminEmails = await getAdminEmails()
    
    // Generate email content
    const emailContent = generateAdminEmailContent(orderData)
    
    // Send email to each admin
    const results = []
    for (const adminEmail of adminEmails) {
      try {
        await sendEmailToAdmin(adminEmail, orderData.id, emailContent)
        results.push({ email: adminEmail, status: 'success' })
      } catch (error) {
        console.error(`Failed to send to ${adminEmail}:`, error)
        results.push({ email: adminEmail, status: 'failed', error: error.message })
      }
    }

    // Save notification record
    await saveNotificationRecord(orderData, adminEmails, results)

    return NextResponse.json({ 
      success: true, 
      orderId: orderData.id,
      sentTo: adminEmails.length,
      results: results
    })

  } catch (error) {
    console.error('Order notification failed:', error)
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 })
  }
}

async function getAdminEmails(): Promise<string[]> {
  try {
    const adminsSnapshot = await getDoc(doc(firestore, 'admins', 'config'))
    const adminData = adminsSnapshot.data()
    
    if (adminData?.emails && Array.isArray(adminData.emails)) {
      return adminData.emails
    }
    
    // Fallback emails
    return ['admin@fireshop.com', 'orders@fireshop.com']
  } catch (error) {
    console.error('Failed to get admin emails:', error)
    return ['admin@fireshop.com']
  }
}

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
      <td style="padding: 8px; border: 1px solid #ddd;">${product.name}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${product.quantity}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">Rs.${product.discountedPrice}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">Rs.${product.discountedPrice * product.quantity}</td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Notification</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b6b, #ffa500); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; }
        .order-info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #ffa500; }
        .customer-info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #4CAF50; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background: #ffa500; color: white; padding: 10px; text-align: left; }
        .total-row { font-weight: bold; background: #f0f0f0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .btn { display: inline-block; padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>FireShop - New Order Received! </h1>
          <p>Order #${orderData.id}</p>
        </div>
        
        <div class="content">
          <div class="order-info">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> #${orderData.id}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Status:</strong> ${orderData.status}</p>
            <p><strong>Total Amount:</strong> <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">Rs.${orderData.totalPrice}</span></p>
          </div>

          <div class="customer-info">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${orderData.customerInfo.name}</p>
            <p><strong>Email:</strong> ${orderData.customerInfo.emailId}</p>
            <p><strong>Phone:</strong> ${orderData.customerInfo.mobileNo}</p>
            <p><strong>Address:</strong> ${orderData.customerInfo.address}</p>
            <p><strong>City:</strong> ${orderData.customerInfo.city}</p>
            <p><strong>Pincode:</strong> ${orderData.customerInfo.pincode}</p>
          </div>

          <h3>Order Items</h3>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${productsTable}
              <tr class="total-row">
                <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; color: #4CAF50;">Rs.${orderData.totalPrice}</td>
              </tr>
            </tbody>
          </table>

          <div style="text-align: center; margin: 20px 0;">
            <a href="mailto:${orderData.customerInfo.emailId}" class="btn">Contact Customer</a>
          </div>
        </div>

        <div class="footer">
          <p>This is an automated notification from FireShop. Please do not reply to this email.</p>
          <p>© 2024 FireShop. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

async function sendEmailToAdmin(adminEmail: string, orderId: string, emailContent: string): Promise<void> {
  // Method 1: Try SendGrid if available
  if (process.env.SENDGRID_API_KEY) {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: adminEmail }],
          subject: `New Order Received - Order #${orderId}`,
        }],
        from: { email: 'noreply@fireshop.com', name: 'FireShop' },
        content: [{ type: 'text/html', value: emailContent }],
      })
    })

    if (response.ok) {
      console.log(`Email sent to ${adminEmail} via SendGrid`)
      return
    }
  }

  // Method 2: Try Resend if available
  if (process.env.RESEND_API_KEY) {
    const response = await fetch('https://api.resend.com/v1/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'FireShop <noreply@fireshop.com>',
        to: [adminEmail],
        subject: `New Order Received - Order #${orderId}`,
        html: emailContent,
      })
    })

    if (response.ok) {
      console.log(`Email sent to ${adminEmail} via Resend`)
      return
    }
  }

  // Method 3: Save to Firestore for manual sending
  await setDoc(doc(firestore, 'email-queue', `${Date.now()}_${adminEmail.replace(/[^a-zA-Z0-9]/g, '')}`), {
    to: adminEmail,
    subject: `New Order Received - Order #${orderId}`,
    html: emailContent,
    createdAt: new Date().toISOString(),
    status: 'pending',
    orderId: orderId
  })

  console.log(`Email saved to queue for ${adminEmail}`)
}

async function saveNotificationRecord(orderData: OrderData, adminEmails: string[], results: any[]) {
  try {
    await setDoc(doc(firestore, 'order-notifications', orderData.id), {
      orderId: orderData.id,
      customerName: orderData.customerInfo.name,
      totalAmount: orderData.totalPrice,
      adminEmails: adminEmails,
      results: results,
      createdAt: new Date().toISOString(),
      status: 'processed'
    })
  } catch (error) {
    console.error('Failed to save notification record:', error)
  }
}
