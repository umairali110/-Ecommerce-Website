import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 📦 ORDER PLACED EMAIL (HTML VERSION)
  async sendOrderEmail(to: string, orderId: number, amount: number) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: `🛒 Order #${orderId} Confirmed`,
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>🎉 Order Placed Successfully</h2>
          <p>Your order has been confirmed.</p>
          <h3>Order ID: #${orderId}</h3>
          <p><b>Total Amount:</b> Rs ${amount}</p>
          <hr/>
          <p>We will notify you when your order is shipped.</p>
        </div>
      `,
    });
  }

  async sendDeliveredEmail(to: string, orderId: number) {
  await this.transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: `📦 Order #${orderId} Delivered`,
    html: `
      <div style="font-family:Arial;padding:20px">
        <h2>🎉 Order Delivered</h2>
        <p>Your order #${orderId} has been successfully delivered.</p>
        <p>Thank you for shopping with us ❤️</p>
      </div>
    `,
  });
}

  // 🚚 ORDER SHIPPED EMAIL
  async sendShippedEmail(to: string, orderId: number) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: `🚚 Order #${orderId} Shipped`,
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>Your Order is On the Way 🚀</h2>
          <p>Order ID: #${orderId}</p>
          <p>Your package has been shipped.</p>
        </div>
      `,
    });
  }

  // ❌ ORDER CANCELLED EMAIL
  async sendCancelledEmail(to: string, orderId: number) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: `❌ Order #${orderId} Cancelled`,
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>Order Cancelled</h2>
          <p>Order ID: #${orderId}</p>
          <p>If this was a mistake, you can place a new order anytime.</p>
        </div>
      `,
    });
  }
  async sendOtpEmail(to: string, otp: string) {
  await this.transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your OTP Code',
    html: `
      <div style="font-family:Arial;padding:20px">
        <h2>Email Verification</h2>
        <p>Your OTP code is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in a few minutes.</p>
      </div>
    `,
  });
}
}
