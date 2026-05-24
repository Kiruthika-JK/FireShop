import { NextRequest, NextResponse } from 'next/server'
import { firestore } from '@/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'

interface CustomerNotificationData {
  orderId: string
  customerEmail: string
  customerName: string
  type: 'order_confirmation' | 'status_update'
  status?: string
  orderData?: any
  previousStatus?: string
}

export async function POST(request: NextRequest) {
  try {
    const notificationData: CustomerNotificationData = await request.json()

    if (!notificationData || !notificationData.customerEmail) {
      return NextResponse.json({ error: 'Invalid notification data' }, { status: 400 })
    }

    console.log(`Sending customer notification: ${notificationData.type} for order ${notificationData.orderId}`)

    let emailContent: string
    let subject: string

    if (notificationData.type === 'order_confirmation') {
      subject = `Order Confirmation - FireShop Order #${notificationData.orderId}`
      emailContent = generateOrderConfirmationEmail(notificationData)
    } else if (notificationData.type === 'status_update') {
      subject = `Order Status Update - FireShop Order #${notificationData.orderId}`
      emailContent = generateStatusUpdateEmail(notificationData)
    } else {
      return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 })
    }

    // Send email to customer
    const result = await sendEmailToCustomer(
      notificationData.customerEmail,
      subject,
      emailContent,
      notificationData.type
    )

    // Save notification record
    await saveCustomerNotificationRecord(notificationData, result)

    return NextResponse.json({
      success: true,
      orderId: notificationData.orderId,
      customerEmail: notificationData.customerEmail,
      type: notificationData.type,
      result: result
    })

  } catch (error) {
    console.error('Customer notification failed:', error)
    return NextResponse.json({ error: 'Failed to send customer notification' }, { status: 500 })
  }
}

function generateOrderConfirmationEmail(data: CustomerNotificationData): string {
  const orderData = data.orderData
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
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4CAF50, #45a049); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; }
        .order-info { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #4CAF50; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .customer-info { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #2196F3; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .next-steps { background: #fff3cd; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ffc107; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #4CAF50; color: white; padding: 12px; text-align: left; }
        td { padding: 12px; border: 1px solid #ddd; }
        .total-row { font-weight: bold; background: #f0f0f0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .btn { display: inline-block; padding: 12px 24px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; font-weight: bold; }
        .highlight { color: #4CAF50; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed! </h1>
          <p>Thank you for your order, ${data.customerName}!</p>
          <p style="font-size: 18px; margin-top: 10px;">Order #${data.orderId}</p>
        </div>
        
        <div class="content">
          <div class="order-info">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> <span class="highlight">#${data.orderId}</span></p>
            <p><strong>Order Date:</strong> ${formattedDate}</p>
            <p><strong>Status:</strong> <span class="highlight">${orderData.status}</span></p>
            <p><strong>Total Amount:</strong> <span style="color: #4CAF50; font-size: 20px; font-weight: bold;">Rs.${orderData.totalPrice}</span></p>
          </div>

          <div class="customer-info">
            <h3>Delivery Information</h3>
            <p><strong>Name:</strong> ${orderData.customerInfo.name}</p>
            <p><strong>Phone:</strong> ${orderData.customerInfo.mobileNo}</p>
            <p><strong>Address:</strong> ${orderData.customerInfo.address}</p>
            <p><strong>City:</strong> ${orderData.customerInfo.city}</p>
            <p><strong>Pincode:</strong> ${orderData.customerInfo.pincode}</p>
          </div>

          <div class="next-steps">
            <h3>What's Next?</h3>
            <p>1. We'll process your order within 24 hours</p>
            <p>2. You'll receive updates when your order ships</p>
            <p>3. Expected delivery: 3-5 business days</p>
            <p>4. You can track your order status anytime</p>
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
                <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 12px; text-align: right; font-weight: bold; color: #4CAF50;">Rs.${orderData.totalPrice}</td>
              </tr>
            </tbody>
          </table>

          <div style="text-align: center; margin: 30px 0;">
            <p style="margin-bottom: 20px;">Need help? Contact our support team:</p>
            <a href="tel:${orderData.customerInfo.mobileNo}" class="btn">Call Support</a>
            <a href="mailto:support@fireshop.com" class="btn">Email Support</a>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for choosing FireShop! We appreciate your business.</p>
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>© 2024 FireShop. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateStatusUpdateEmail(data: CustomerNotificationData): string {
  const statusMessages = {
    'Ordered': 'Your order has been received and is being processed.',
    'Processing': 'Your order is being processed and will be shipped soon.',
    'Ready to Ship': 'Your order is packed and ready to be shipped.',
    'shipped': 'Great news! Your order has been shipped and is on its way to you.',
    'delivered': 'Your order has been delivered. We hope you enjoy your purchase!',
    'cancelled': 'Your order has been cancelled. We apologize for any inconvenience.'
  }

  const statusColors = {
    'Ordered': '#FFA500',
    'Processing': '#2196F3',
    'Ready to Ship': '#9C27B0',
    'shipped': '#FF9800',
    'delivered': '#4CAF50',
    'cancelled': '#f44336'
  }

  const message = statusMessages[data.status] || 'Your order status has been updated.'
  const color = statusColors[data.status] || '#666'

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Status Update</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, ${color}, ${color}dd); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; }
        .status-box { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border-left: 4px solid ${color}; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
        .order-info { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .btn { display: inline-block; padding: 12px 24px; background: ${color}; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; font-weight: bold; }
        .status-text { font-size: 24px; font-weight: bold; margin: 15px 0; }
        .highlight { color: ${color}; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Status Update</h1>
          <p>Your order status has changed!</p>
        </div>
        
        <div class="content">
          <div class="status-box">
            <h2>Order #${data.orderId}</h2>
            <div class="status-text">${data.status?.toUpperCase()}</div>
            <p style="font-size: 16px; margin: 20px 0;">${message}</p>
            ${data.previousStatus ? `<p><small>Previous status: ${data.previousStatus}</small></p>` : ''}
          </div>

          <div class="order-info">
            <h3>Order Information</h3>
            <p><strong>Order ID:</strong> <span class="highlight">#${data.orderId}</span></p>
            <p><strong>Customer:</strong> ${data.customerName}</p>
            <p><strong>Email:</strong> ${data.customerEmail}</p>
            <p><strong>Updated:</strong> ${new Date().toLocaleString('en-IN')}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <p style="margin-bottom: 20px;">Need assistance with your order?</p>
            <a href="mailto:support@fireshop.com" class="btn">Contact Support</a>
            <a href="/orders/${data.orderId}" class="btn">View Order</a>
          </div>
        </div>

        <div class="footer">
          <p>This is an automated notification about your FireShop order.</p>
          <p>© 2024 FireShop. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

async function sendEmailToCustomer(customerEmail: string, subject: string, htmlContent: string, type: string): Promise<any> {
  // Use immediate email sending API
  try {
    const response = await fetch('/api/send-email-immediate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: customerEmail,
        subject: subject,
        html: htmlContent,
        from: 'FireShop <noreply@fireshop.com>'
      })
    })

    if (response.ok) {
      const result = await response.json()
      console.log(`Customer email sent immediately to ${customerEmail} via ${result.method}`)
      return { method: result.method, status: 'success', messageId: result.messageId }
    } else {
      throw new Error('Immediate email failed')
    }
  } catch (error) {
    console.error('Immediate email sending failed, trying fallback:', error)
    
    // Fallback: Try SendGrid if available
    if (process.env.SENDGRID_API_KEY) {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: customerEmail }],
            subject: subject,
          }],
          from: { email: 'noreply@fireshop.com', name: 'FireShop' },
          content: [{ type: 'text/html', value: htmlContent }],
        })
      })

      if (response.ok) {
        console.log(`Customer email sent to ${customerEmail} via SendGrid`)
        return { method: 'sendgrid', status: 'success' }
      }
    }

    // Final fallback: Save to Firestore for manual sending
    await setDoc(doc(firestore, 'customer-email-queue', `${Date.now()}_${customerEmail.replace(/[^a-zA-Z0-9]/g, '')}`), {
      to: customerEmail,
      subject: subject,
      html: htmlContent,
      type: type,
      createdAt: new Date().toISOString(),
      status: 'pending'
    })

    console.log(`Customer email saved to queue for ${customerEmail}`)
    return { method: 'queue', status: 'pending' }
  }
}

async function saveCustomerNotificationRecord(data: CustomerNotificationData, result: any) {
  try {
    await setDoc(doc(firestore, 'customer-notifications', `${data.orderId}_${data.type}_${Date.now()}`), {
      orderId: data.orderId,
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      type: data.type,
      status: data.status,
      result: result,
      createdAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to save customer notification record:', error)
  }
}
