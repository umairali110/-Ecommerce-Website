import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart/entities/cartItem.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/ordersitem.entity';
import { Product } from 'src/products/entities/product.entity';
import { BadRequestException } from '@nestjs/common';
import { Users } from 'src/users/entities/user.entity';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Product)
private productRepo: Repository<Product>,
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,

    @InjectRepository(CartItem)
    private cartItemRepo: Repository<CartItem>,

    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,
     private emailService: EmailService,
     
     @InjectRepository(Users)
  private userRepo: Repository<Users>,
  ) {}


  async cancelOrder(userId: number, orderId: number) {
  const order = await this.orderRepo.findOne({
    where: {
      id: orderId,
      user: { id: userId },
    },
    relations: {
      user: true,
    },
  });

  if (!order) {
    throw new NotFoundException('Order not found');
  }

  // ❌ prevent double cancel
  if (order.status === 'cancelled') {
    throw new BadRequestException('Order already cancelled');
  }

  // ❌ prevent cancel after delivery
 if (
  order.status === 'confirmed' ||
  order.status === 'shipped' ||
  order.status === 'delivered'
) {
  throw new BadRequestException(
    `Order cannot be cancelled because it is ${order.status}`,
  );
}

  // get order items
  const items = await this.orderItemRepo.find({
    where: {
      order: { id: order.id },
    },
    relations: {
      product: true,
    },
  });

  for (const item of items) {
    const product = item.product;
    product.stock += item.quantity;
    await this.productRepo.save(product);
  }

  order.status = 'cancelled';
  await this.orderRepo.save(order);
  await this.emailService.sendCancelledEmail(
  order.user.email,
  order.id,
);

  return {
    message: 'Order cancelled successfully',
    orderId: order.id,
  };
}

  async checkout(userId: number) {
  const cart = await this.cartRepo.findOne({
    where: { user: { id: userId } },
    relations: {
      items: { product: true },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new NotFoundException('Cart is empty');
  }

  let totalAmount = 0;

  const order = this.orderRepo.create({
    user: { id: userId } as any,
    totalAmount: 0,
    status: 'pending',
  });

  await this.orderRepo.save(order);

  for (const item of cart.items) {
    const product = item.product;

    if (product.stock < item.quantity) {
      throw new BadRequestException(
        `Not enough stock for ${product.name}`,
      );
    }

    const productPrice = Number(product.price);
    totalAmount += productPrice * item.quantity;

    product.stock -= item.quantity;
    await this.productRepo.save(product);

    const orderItem = this.orderItemRepo.create({
      order: { id: order.id } as any,
      product: { id: product.id } as any,
      quantity: item.quantity,
      price: productPrice,
    });

    await this.orderItemRepo.save(orderItem);
  }

  order.totalAmount = totalAmount;
  await this.orderRepo.save(order);
  await this.cartItemRepo.delete({
    cart: { id: cart.id } as any,
  });
  const user = await this.userRepo.findOne({
  where: { id: userId },
});

if (!user) {
  throw new NotFoundException('User not found');
}

await this.emailService.sendOrderEmail(
  user.email,
  order.id,
  totalAmount,
);

  return {
    message: 'Order placed successfully',
    orderId: order.id,
    totalAmount,
  };
}

  async getMyOrders(userId: number) {
    const orders = await this.orderRepo.find({
      where: { user: { id: userId } },
      relations: { user: true },
      order: { id: 'DESC' },
    });

    return orders.map(order => ({
      id: order.id,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      user: {
        id: order.user.id,
        name: order.user.name,
        email: order.user.email,
        role: order.user.role,
      },
    }));
  }

 async getAllOrders(status?:  'pending' | 'shipped' | 'delivered',) {
  const where = status ? { status } : {};

  return this.orderRepo.find({
    where,
    relations: {
      user: true,
    },
    select: {
      id: true,
      totalAmount: true,
      status: true,
      createdAt: true,
      user: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    },
  });
}

async updateStatus(
  orderId: number,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'confirmed',
) {
  const order = await this.orderRepo.findOne({
    where: { id: orderId },
    relations: { user: true },
  });

  if (!order) {
    throw new NotFoundException('Order not found');
  }

  const validStatuses = ['pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    throw new BadRequestException('Invalid status');
  }

  order.status = status;
  await this.orderRepo.save(order);

  if (status === 'shipped') {
    await this.emailService.sendShippedEmail(order.user.email, order.id);
  }

  if (status === 'delivered') {
    await this.emailService.sendDeliveredEmail(order.user.email, order.id);
  }

  return order;
}
  async getOrderById(userId: number, orderId: number) {
    const order = await this.orderRepo.findOne({
      where: {
        id: orderId,
        user: { id: userId },
      },
      relations: {
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const items = await this.orderItemRepo.find({
      where: {
        order: { id: order.id },
      },
      relations: {
        product: true,
      },
    });

    return {
      id: order.id,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      user: {
        id: order.user.id,
        name: order.user.name,
        email: order.user.email,
        role: order.user.role,
      },
      items,
    };
  }
}