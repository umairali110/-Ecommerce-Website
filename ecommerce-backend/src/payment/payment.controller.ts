import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PaymentService } from "./payment.service";
import { Order } from "../orders/entities/order.entity";

@Controller("payment")
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}
  @Post()
  create(@Body() body: { orderId: number; method: string }) {
    return this.paymentService.createPayment(
      body.orderId,
      body.method,
    );
  }
  @Patch("paid/:id")
  markPaid(@Param("id") id: string) {
    return this.paymentService.markPaid(+id);
  }
  @Get("stripe/:orderId")
  async stripePay(@Param("orderId") orderId: string) {
    const order = await this.orderRepo.findOne({
      where: { id: +orderId },
    });

    if (!order) {
      throw new BadRequestException("Order not found");
    }

    return this.paymentService.createStripePayment(
      order.id,
      Number(order.totalAmount),
    );
  }
}