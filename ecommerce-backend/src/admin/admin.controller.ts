import { Controller, Get, UseGuards,Query,Param} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getStats() {
    return this.adminService.getDashboardStats();
  }
  @Get('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
getOrders(@Query('status') status?: string) {
  return this.adminService.getAdminOrders(
    status as any,
  );
}
@Get('orders/:id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
getOrderDetail(@Param('id') id: number) {
  return this.adminService.getOrderDetail(+id);
}
@Get('analytics/revenue')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
getRevenue() {
  return this.adminService.getRevenueAnalytics();
}
@Get('analytics/top-products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
getTopProducts() {
  return this.adminService.getTopProducts();
}
@Get('analytics/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
getOrderStats() {
  return this.adminService.getOrderStats();
}
}
