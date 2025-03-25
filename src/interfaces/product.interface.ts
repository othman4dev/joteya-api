import { UserInterface } from './user.interface';

export interface ProductInterface {
  id?: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  quantity: number;
  status: string;
  authenticity: string;
  condition: string;
  category: string;
  sex: string;
  size: string;
  userId: string;
  user?: UserInterface;
  productImages: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
