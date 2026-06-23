import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Order } from "src/orders/entities/order.entity";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Order)
  order!: Order;

  @Column()
  method!: 'cod' | 'stripe' | 'paypal';

  @Column({ default: 'pending' })
  status!: 'pending' | 'paid' | 'failed';

  @Column('decimal')
  amount!: number;

  @CreateDateColumn()
  createdAt!: Date;
}