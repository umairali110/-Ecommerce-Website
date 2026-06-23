import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  Param,
  Body,
  Patch,
  Query,BadRequestException
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import { OrdersService } from './orders.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { AdminService } from 'src/admin/admin.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService:OrdersService,
    private readonly adminService: AdminService
  ) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  checkout(@Request() req) {
    return this.orderService.checkout(req.user.id);
  }

@Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAll(@Query('status') status?: string) {
    return this.orderService.getAllOrders(status as any);
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  getMyOrders(@Request() req) {
    return this.orderService.getMyOrders(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getOrderById(@Request() req, @Param('id') id: string) {
    const orderId = Number(id);

    if (isNaN(orderId)) {
      throw new BadRequestException('Invalid order id');
    }

    return this.orderService.getOrderById(req.user.id, orderId);
  }

@Patch('status/:id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
updateStatus(
  @Param('id') id: string,
  @Body() body: {
    status: 'pending' | 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  },
) {
  return this.orderService.updateStatus(+id, body.status);
}

@Patch('cancel/:id')
@UseGuards(JwtAuthGuard)
cancelOrder(@Request() req, @Param('id') id: string) {
  return this.orderService.cancelOrder(req.user.id, +id);
}
}

