import { Column, PrimaryGeneratedColumn, Entity, CreateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { Users } from "src/users/entities/user.entity";
import { OrderItem } from "./ordersitem.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Users)
  user!: Users;

  @Column('decimal')
  totalAmount!: number;

  @Column({ default: 'pending' })
  status!: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => OrderItem, (item) => item.order)
  items!: OrderItem[];
}