import { Controller, Get, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('user/:userId')
  async getPaymentsByUser(@Param('userId') userId: string) {
    return this.paymentService.getPaymentsByUser(userId);
  }

  @Get('seller/:sellerId')
  async getPaymentsBySeller(@Param('sellerId') sellerId: string) {
    return this.paymentService.getPaymentsBySeller(sellerId);
  }
}
