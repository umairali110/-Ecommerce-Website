import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,OneToMany} from 'typeorm';
import { Product } from 'src/products/entities/product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ default: 'active' })
  status!: 'active' | 'inactive';

  @OneToMany(() => Product, (product) => product.category)
  products!: Product[];

  @CreateDateColumn()
  createdAt!: Date;
}