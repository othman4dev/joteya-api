export interface PaymentInterface {
  id?: string;
  user_id: string;
  seller_id: string;
  products: Array<{
    product_id: string;
    quantity: number;
    price: number;
    name: string;
  }>;
  total_amount: number;
  payment_intent_id: string;
  session_id: string;
  status: PaymentStatus;
  shipping_address?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
}
