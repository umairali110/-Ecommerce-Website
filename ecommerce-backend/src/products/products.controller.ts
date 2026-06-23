import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import { RolesGuard } from 'src/common/guards/roles.guards';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ✅ FIXED: Static routes MUST come before dynamic (:id) routes
  // Otherwise NestJS treats "create" and "upload" as an :id param

  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    return this.productsService.createWithImage(body, file);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.productsService.uploadImage(file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles('admin')
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 8,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: number,
  ) {
    return this.productsService.findAll(
      +page,
      +limit,
      search,
      categoryId ? +categoryId : undefined,
    );
  }

  // ✅ Dynamic :id routes come LAST
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const dto = {
      name: body.name,
      description: body.description,
      price: body.price ? Number(body.price) : undefined,
      stock: body.stock ? Number(body.stock) : undefined,
      categoryId: body.categoryId ? Number(body.categoryId) : undefined,
    };
    return this.productsService.updateWithImage(+id, dto, file);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productsService.delete(+id);
  }
}