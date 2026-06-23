import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { Users } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { Order } from 'src/orders/entities/order.entity';
import { OrderItem } from 'src/orders/entities/ordersitem.entity';
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
  ) {}

  async getDashboardStats() {
    const totalUsers = await this.userRepo.count();
    const totalProducts = await this.productRepo.count();

    const totalOrders = await this.orderRepo.count();

    const pendingOrders = await this.orderRepo.count({
      where: { status: 'pending' },
    });

    const cancelledOrders = await this.orderRepo.count({
      where: { status: 'cancelled' },
    });

    const deliveredOrders = await this.orderRepo.count({
      where: { status: 'delivered' },
    });

    const orders = await this.orderRepo.find({
      where: { status: 'delivered' },
    });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0,
    );

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      cancelledOrders,
      deliveredOrders,
      totalRevenue,
    };
  }
  async getAdminOrders(status?: 'pending' | 'shipped' | 'delivered' | 'cancelled') {
  const where = status ? { status } : {};

  return this.orderRepo.find({
    where,
    relations: { user: true },
    order: { createdAt: 'DESC' },
  });
}
async getOrderDetail(orderId: number) {
  const order = await this.orderRepo.findOne({
    where: { id: orderId },
    relations: {
      user: true,
      items: { product: true },
    },
  });

  if (!order) {
    throw new NotFoundException('Order not found');
  }

  return order;
}
async getRevenueAnalytics() {
  const orders = await this.orderRepo.find({
    where: { status: 'delivered' },
  });

  let totalRevenue = 0;

  const dailyMap: Record<string, number> = {};

  for (const order of orders) {
    const date = order.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD

    totalRevenue += Number(order.totalAmount);

    if (!dailyMap[date]) {
      dailyMap[date] = 0;
    }

    dailyMap[date] += Number(order.totalAmount);
  }

  return {
    totalRevenue,
    dailyRevenue: dailyMap,
  };
}
async getTopProducts() {
  const items = await this.orderItemRepo.find({
    relations: { product: true },
  });

  const map: Record<number, { name: string; qty: number }> = {};

  for (const item of items) {
    const id = item.product.id;

    if (!map[id]) {
      map[id] = {
        name: item.product.name,
        qty: 0,
      };
    }

    map[id].qty += item.quantity;
  }

  return Object.values(map).sort((a, b) => b.qty - a.qty);
}
async getOrderStats() {
  const pending = await this.orderRepo.count({ where: { status: 'pending' } });
  const shipped = await this.orderRepo.count({ where: { status: 'shipped' } });
  const delivered = await this.orderRepo.count({ where: { status: 'delivered' } });
  const cancelled = await this.orderRepo.count({ where: { status: 'cancelled' } });

  return {
    pending,
    shipped,
    delivered,
    cancelled,
  };
}
}