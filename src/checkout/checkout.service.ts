import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class CheckoutService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private productRepository: ProductRepository,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2025-02-24.acacia',
      },
    );
  }

  async createCheckoutSession(cartItems: any[]) {
    try {
      // Transform cart items into Stripe line items
      const lineItems = await Promise.all(
        cartItems.map(async (item) => {
          // Fetch the product to ensure we have the latest price and availability
          const product = await this.productRepository.findById(
            item.product_id,
          );

          if (!product) {
            throw new Error(`Product ${item.product_id} not found`);
          }

          if (product.quantity < item.quantity) {
            throw new Error(`Not enough stock for product ${product.name}`);
          }

          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.product.name,
                description: item.product.description?.substring(0, 255) || '',
                images: item.product.images
                  ? [
                      `${this.configService.get('BACKEND_URL')}/uploads/${item.product.images[0]}`,
                    ]
                  : [],
              },
              unit_amount: item.product.price * 100, // Stripe expects amounts in cents
            },
            quantity: item.quantity,
          };
        }),
      );

      // Create the checkout session
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${this.configService.get('FRONTEND_URL')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.configService.get('FRONTEND_URL')}/cart`,
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'MA'], // Add Morocco and other countries you support
        },
        metadata: {
          cartItems: JSON.stringify(
            cartItems.map((item) => ({
              id: item.id,
              product_id: item.product_id,
              quantity: item.quantity,
            })),
          ),
        },
      });

      return { url: session.url };
    } catch (error) {
      console.error('Stripe session creation error:', error);
      throw new Error(`Failed to create checkout session: ${error.message}`);
    }
  }
}
