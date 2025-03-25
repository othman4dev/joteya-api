import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { PaymentService } from '../payment/payment.service';

@Controller('checkout')
export class CheckoutController {
  constructor(
    private checkoutService: CheckoutService,
    private paymentService: PaymentService,
  ) { }

  @Post('create-checkout-session')
  async createCheckoutSession(@Body() body: { cart: any[] }) {
    return this.checkoutService.createCheckoutSession(body.cart);
  }

  @Get('payment-success')
  async handleSuccessfulPayment(@Query('session_id') sessionId: string) {
    return this.paymentService.handleSuccessfulPayment(sessionId);
  }
}
