import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { getCloudinary } from 'src/common/cloudinary.config';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async createWithImage(dto: any, file: Express.Multer.File) {
    let imageUrl = '';

    if (file) {
      const cloudinary = getCloudinary();
      const result: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: 'products' }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const categoryId = +dto.categoryId;
    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
    });

    if (!category) throw new Error('Category not found');

    const product = this.productRepo.create({
      name: dto.name,
      description: dto.description,
      price: +dto.price,
      stock: +dto.stock,
      image: imageUrl,
      category,
      categoryId,
    });

    return this.productRepo.save(product);
  }

  async updateWithImage(id: number, dto: any, file?: Express.Multer.File) {
    const product = await this.productRepo.findOne({ where: { id } });

    if (!product) throw new Error('Product not found');

    if (file) {
      const cloudinary = getCloudinary();
      const result: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: 'products' }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(file.buffer);
      });
      product.image = result.secure_url;
    }

    if (dto.name) product.name = dto.name;
    if (dto.description) product.description = dto.description;
    if (dto.price !== undefined) product.price = Number(dto.price);
    if (dto.stock !== undefined) product.stock = Number(dto.stock);

    if (dto.categoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: Number(dto.categoryId) },
      });
      if (category) {
        product.category = category;
        product.categoryId = category.id;
      }
    }

    return this.productRepo.save(product);
  }

  async uploadImage(file: Express.Multer.File) {
    const cloudinary = getCloudinary();
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'products' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      stream.end(file.buffer);
    });
  }

  async create(dto: CreateProductDto) {
    const category = await this.categoryRepo.findOne({
      where: { id: dto.categoryId },
    });

    if (!category) throw new Error('Category not found');

    const product = this.productRepo.create({ ...dto, category });
    return this.productRepo.save(product);
  }

  async findAll(page: number, limit: number, search?: string, categoryId?: number) {
  const skip = (page - 1) * limit;
  const where: any = {};

  if (categoryId) where.categoryId = categoryId;
  if (search) where.name = Like(`%${search}%`);

  const [data, total] = await this.productRepo.findAndCount({
    where,
    skip,
    take: limit,
    relations: { category: true },
  });

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

  findOne(id: number) {
    return this.productRepo.findOne({
      where: { id },
      relations: { category: true },
    });
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.productRepo.update(id, dto);
    return this.findOne(id);
  }

  delete(id: number) {
    return this.productRepo.delete(id);
  }
}