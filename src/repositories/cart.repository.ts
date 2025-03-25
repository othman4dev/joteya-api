import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../firestore/firestore.service';
import { DatabaseTables } from '../enums/database-tables.enum';
import { CartInterface } from '../interfaces/cart.interface';

@Injectable()
export class CartRepository {
  constructor(private readonly firestoreService: FirestoreService) {}

  async create(cart: CartInterface): Promise<string> {
    return this.firestoreService.addDocument(DatabaseTables.CART, cart);
  }

  async findAll(): Promise<CartInterface[]> {
    return this.firestoreService.getAllDocuments(
      DatabaseTables.CART,
    ) as Promise<CartInterface[]>;
  }

  async findById(id: string): Promise<CartInterface | null> {
    return this.firestoreService.getDocument(
      DatabaseTables.CART,
      id,
    ) as Promise<CartInterface | null>;
  }

  async findByUserId(userId: string): Promise<CartInterface[]> {
    const carts = await this.findAll();
    return carts.filter((cart) => cart.user_id === userId);
  }

  async findByUserIdAndProductId(
    userId: string,
    productId: string,
  ): Promise<CartInterface | null> {
    const carts = await this.findAll();
    return carts.find(
      (cart) => cart.user_id === userId && cart.product_id === productId,
    );
  }

  async update(id: string, cart: Partial<CartInterface>): Promise<void> {
    return this.firestoreService.updateDocument(DatabaseTables.CART, id, cart);
  }

  async delete(id: string): Promise<void> {
    return this.firestoreService.deleteDocument(DatabaseTables.CART, id);
  }

  async removeField(field: string): Promise<void> {
    return this.firestoreService.removeField(DatabaseTables.CART, field);
  }
}
