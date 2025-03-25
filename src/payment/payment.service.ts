import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment.repository';
import { ProductRepository } from '../repositories/product.repository';
import { CartRepository } from '../repositories/cart.repository';
import {
  PaymentInterface,
  PaymentStatus,
} from '../interfaces/payment.interface';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly productRepository: ProductRepository,
    private readonly cartRepository: CartRepository,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2025-02-24.acacia',
      },
    );
  }

  async createPaymentRecord(paymentData: any): Promise<string> {
    const payment: PaymentInterface = {
      user_id: paymentData.userId,
      seller_id: paymentData.sellerId,
      products: paymentData.products,
      total_amount: paymentData.amount,
      payment_intent_id: paymentData.paymentIntentId,
      session_id: paymentData.sessionId,
      status: PaymentStatus.COMPLETED,
      shipping_address: paymentData.shippingAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.paymentRepository.create(payment);
  }

  async handleSuccessfulPayment(sessionId: string): Promise<any> {
    try {
      // Retrieve the session from Stripe to get information about the purchase
      const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
        expand: [
          'line_items',
          'customer',
          'payment_intent',
          'shipping_details',
        ],
      });

      if (!session) {
        throw new Error('Session not found');
      }

      // Check if session has metadata with cart items
      if (!session.metadata || !session.metadata.cartItems) {
        throw new Error('No cart items found in session metadata');
      }

      // Parse cart items from metadata
      const cartItems = JSON.parse(session.metadata.cartItems);

      // Get shipping address if available
      let shippingAddress = null;
      if (session.shipping_details && session.shipping_details.address) {
        shippingAddress = session.shipping_details.address;
      }

      // Create payment records for each seller
      const paymentsBySellerMap = new Map();

      // Group cart items by seller
      for (const item of cartItems) {
        const product = await this.productRepository.findById(item.product_id);
        if (!product) continue;

        if (!paymentsBySellerMap.has(product.userId)) {
          paymentsBySellerMap.set(product.userId, {
            userId: item.user_id || 'guest',
            sellerId: product.userId,
            products: [],
            amount: 0,
            sessionId: sessionId,
            paymentIntentId:
              typeof session.payment_intent === 'string'
                ? session.payment_intent
                : session.payment_intent?.id || 'unknown',
            shippingAddress: shippingAddress,
          });
        }

        const sellerPayment = paymentsBySellerMap.get(product.userId);
        sellerPayment.products.push({
          product_id: item.product_id,
          quantity: item.quantity,
          price: product.price,
          name: product.name,
        });
        sellerPayment.amount += product.price * item.quantity;
      }

      // Create payment records for each seller
      const paymentIds = [];
      for (const payment of paymentsBySellerMap.values()) {
        const paymentId = await this.createPaymentRecord(payment);
        paymentIds.push(paymentId);

        // Update product quantities
        for (const product of payment.products) {
          const productData = await this.productRepository.findById(
            product.product_id,
          );
          if (productData) {
            await this.productRepository.update(product.product_id, {
              quantity: Math.max(0, productData.quantity - product.quantity),
            });
          }
        }
      }

      // Delete cart items
      for (const item of cartItems) {
        if (item.id) {
          await this.cartRepository.delete(item.id);
        }
      }

      return {
        success: true,
        paymentIds,
        message: 'Payment processed successfully',
      };
    } catch (error) {
      console.error('Error handling successful payment:', error);
      throw new Error(`Failed to process payment: ${error.message}`);
    }
  }

  async getPaymentsByUser(userId: string): Promise<PaymentInterface[]> {
    return this.paymentRepository.findByUserId(userId);
  }

  async getPaymentsBySeller(sellerId: string): Promise<PaymentInterface[]> {
    return this.paymentRepository.findBySellerId(sellerId);
  }
}
