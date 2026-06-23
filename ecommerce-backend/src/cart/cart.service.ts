import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cartItem.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,

    @InjectRepository(CartItem)
    private cartItemRepo: Repository<CartItem>,
  ) {}
  async clearCart(userId: number) {
  const cart = await this.cartRepo.findOne({
    where: { user: { id: userId } },
  });

  if (!cart) return;

  return this.cartItemRepo.delete({
    cart: { id: cart.id },
  });
}

  async updateQuantity(itemId: number, quantity: number) {
  const item = await this.cartItemRepo.findOne({
    where: { id: itemId },
  });

  if (!item) {
    throw new Error('Item not found');
  }

  item.quantity = quantity;

  return this.cartItemRepo.save(item);
}

 async removeItem(itemId: number) {
  return this.cartItemRepo.delete(itemId);
}

  async addToCart(userId: number, productId: number, quantity: number) {
  // force integers — belt and suspenders
  userId = parseInt(String(userId), 10);
  productId = parseInt(String(productId), 10);
  quantity = parseInt(String(quantity), 10);

  if (isNaN(userId) || isNaN(productId) || isNaN(quantity) || quantity < 1) {
    throw new Error('Invalid input: all values must be positive integers');
  }

  let cart = await this.cartRepo.findOne({
    where: { user: { id: userId } },
    relations: { items: { product: true } },
  });

  if (!cart) {
    cart = this.cartRepo.create({ user: { id: userId } as any });
    await this.cartRepo.save(cart);
  }

  if (!cart.items) cart.items = [];

  const existingItem = cart.items.find((item) => item.product.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
    return this.cartItemRepo.save(existingItem);
  }

  const newItem = this.cartItemRepo.create({
    cart: { id: cart.id } as any,
    product: { id: productId } as any,
    quantity,
  });

  const savedItem = await this.cartItemRepo.save(newItem);

  return this.cartItemRepo.findOne({
    where: { id: savedItem.id },
    relations: { product: true, cart: true },
  });
}

  async getCart(userId: number) {
    const cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: {
        items: {
          product: true,
        },
      },
    });

    if (!cart) {
      return { items: [], grandTotal: 0 };
    }

    let grandTotal = 0;

    const items = cart.items.map((item) => {
      const total = item.product.price * item.quantity;
      grandTotal += total;

      return {
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        total,
      };
    });

    return {
      id: cart.id,
      items,
      grandTotal,
    };
  }
}