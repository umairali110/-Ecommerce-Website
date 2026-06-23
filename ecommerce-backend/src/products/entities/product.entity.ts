import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('text')
  description!: string;

  @Column('decimal')
  price!: number;

  @Column({ default: 0 })
  stock!: number;

@Column({
  type: 'text',
  nullable: true,
})
image!: string | null;

  // 🔗 Relation with Category
  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  category!: Category;

  @Column()
  categoryId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}