import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, service } = await request.json()

    if (!to || !subject || !html) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Method 1: Gmail SMTP (most reliable)
    if (service === 'gmail') {
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER, // Your Gmail address
          pass: process.env.GMAIL_PASS, // Your Gmail app password
        },
      })

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: to,
        subject: subject,
        html: html,
      }

      const result = await transporter.sendMail(mailOptions)
      console.log('Email sent:', result.messageId)
      
      return NextResponse.json({ success: true, messageId: result.messageId })
    }

    // Method 2: General SMTP
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: to,
      subject: subject,
      html: html,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent:', result.messageId)
    
    return NextResponse.json({ success: true, messageId: result.messageId })

  } catch (error) {
    console.error('Email sending failed:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
