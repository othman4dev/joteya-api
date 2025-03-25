import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartRepository } from '../repositories/cart.repository';
import { FirestoreModule } from '../firestore/firestore.module';
import { ProductRepository } from '../repositories/product.repository';
import { UserRepository } from 'src/repositories/user.repository';

@Module({
  imports: [FirestoreModule],
  controllers: [CartController],
  providers: [CartService, CartRepository, ProductRepository, UserRepository],
  exports: [CartService],
})
export class CartModule {}
