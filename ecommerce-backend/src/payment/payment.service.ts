import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Stripe from "stripe";

import { Payment } from "./entities/payment.entity";
import { Order } from "src/orders/entities/order.entity";
import { EmailService } from "src/email/email.service";

@Injectable()
export class PaymentService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion:"2026-05-27.dahlia",
  });

  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,

    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    private emailService: EmailService,
  ) {}

  async createPayment(orderId: number, method: string) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: { user: true },
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    const payment = this.paymentRepo.create({
      order,
      method: method as any,
      amount: order.totalAmount,
      status: "pending",
    });

    return this.paymentRepo.save(payment);
  }
  async createStripePayment(orderId: number, amount: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: { user: true },
    });

    if (!order) {
      throw new NotFoundException("Order not found");
    }
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Order #${orderId}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],

      success_url: `http://localhost:3000/payment-success?orderId=${orderId}`,
      cancel_url: `http://localhost:3000/payment-cancel`,
    });

    return { url: session.url };
  }
  async markPaid(paymentId: number) {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
      relations: { order: { user: true } },
    });

    if (!payment) {
      throw new NotFoundException("Payment not found");
    }
    payment.status = "paid";
    payment.order.status = "confirmed";

    await this.orderRepo.save(payment.order);
    await this.paymentRepo.save(payment);

    await this.emailService.sendOrderEmail(
      payment.order.user.email,
      payment.order.id,
      payment.amount,
    );

    return {
      message: "Payment successful",
      paymentId: payment.id,
      orderId: payment.order.id,
      status: payment.status,
    };
  }
}