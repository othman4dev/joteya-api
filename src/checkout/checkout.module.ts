import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { ConfigModule } from '@nestjs/config';
import { ProductRepository } from '../repositories/product.repository';
import { FirestoreModule } from '../firestore/firestore.module';
import { PaymentService } from '../payment/payment.service';
import { PaymentRepository } from '../repositories/payment.repository';
import { CartRepository } from '../repositories/cart.repository';

@Module({
  imports: [ConfigModule, FirestoreModule],
  controllers: [CheckoutController],
  providers: [
    CheckoutService,
    ProductRepository,
    PaymentService,
    PaymentRepository,
    CartRepository,
  ],
})
export class CheckoutModule {}
