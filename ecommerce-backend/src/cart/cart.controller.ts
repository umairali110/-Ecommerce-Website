import { Controller, Post, Body, UseGuards, Request, Get, Delete, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @UseGuards(JwtAuthGuard)
  addToCart(@Request() req, @Body() body: any) {
    const productId = parseInt(body.productId, 10);
    const quantity = parseInt(body.quantity, 10) || 1;
    return this.cartService.addToCart(
      parseInt(req.user.id, 10),
      productId,
      quantity,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getCart(@Request() req) {
    return this.cartService.getCart(parseInt(req.user.id, 10));
  }

  @Delete('item/:id')
  @UseGuards(JwtAuthGuard)
  removeItem(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.removeItem(id);
  }

  @Patch('item/:id')
  @UseGuards(JwtAuthGuard)
  updateQuantity(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.cartService.updateQuantity(id, parseInt(body.quantity, 10));
  }

  @Delete('clear')
  @UseGuards(JwtAuthGuard)
  clearCart(@Request() req) {
    return this.cartService.clearCart(parseInt(req.user.id, 10));
  }
}