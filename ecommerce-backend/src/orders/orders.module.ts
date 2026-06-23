import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrderController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/ordersitem.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart/entities/cartItem.entity';
import { Product } from 'src/products/entities/product.entity';
import { AdminModule } from 'src/admin/admin.module';
import { EmailModule } from 'src/email/email.module';
import { Users } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Cart, CartItem,Product,Users]),
    AdminModule,EmailModule
  ],
  controllers: [OrderController],
  providers: [OrdersService],
})
export class OrdersModule {}