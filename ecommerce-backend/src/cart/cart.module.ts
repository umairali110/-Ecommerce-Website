import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cartItem.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
   imports: [
    TypeOrmModule.forFeature([Cart, CartItem]), 
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
