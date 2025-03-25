import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirestoreModule } from './firestore/firestore.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './auth/user.module';
import { MailModule } from './mail/mail.module';
import { ProductsModule } from './products/products.module';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { JwtMiddleware } from './middlewares/jwt.middleware';
import { CartModule } from './cart/cart.module';
import { CheckoutController } from './checkout/checkout.controller';
import { CheckoutService } from './checkout/checkout.service';
import { CheckoutModule } from './checkout/checkout.module';
import { PaymentModule } from './payment/payment.module';

@Global()
@Module({
  imports: [
    FirestoreModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    ProductsModule,
    MailModule,
    CartModule,
    CheckoutModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [MailModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
