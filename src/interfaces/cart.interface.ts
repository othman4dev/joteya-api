export interface CartInterface {
  id?: string;
  user_id: string;
  product_id: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}
