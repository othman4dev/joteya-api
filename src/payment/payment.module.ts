import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentRepository } from '../repositories/payment.repository';
import { FirestoreModule } from '../firestore/firestore.module';
import { ProductRepository } from '../repositories/product.repository';
import { CartRepository } from '../repositories/cart.repository';

@Module({
  imports: [FirestoreModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentRepository,
    ProductRepository,
    CartRepository,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
