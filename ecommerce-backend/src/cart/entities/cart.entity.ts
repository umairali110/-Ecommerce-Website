import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { CartItem } from './cartItem.entity';
import { Users } from 'src/users/entities/user.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Users)
  user!: Users;

  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
items!: CartItem[];
}