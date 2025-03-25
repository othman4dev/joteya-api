import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../firestore/firestore.service';
import { DatabaseTables } from '../enums/database-tables.enum';
import { PaymentInterface } from '../interfaces/payment.interface';

@Injectable()
export class PaymentRepository {
  constructor(private readonly firestoreService: FirestoreService) {}

  async create(payment: PaymentInterface): Promise<string> {
    return this.firestoreService.addDocument(DatabaseTables.PAYMENT, payment);
  }

  async findAll(): Promise<PaymentInterface[]> {
    return this.firestoreService.getAllDocuments(
      DatabaseTables.PAYMENT,
    ) as Promise<PaymentInterface[]>;
  }

  async findById(id: string): Promise<PaymentInterface | null> {
    return this.firestoreService.getDocument(
      DatabaseTables.PAYMENT,
      id,
    ) as Promise<PaymentInterface | null>;
  }

  async findByUserId(userId: string): Promise<PaymentInterface[]> {
    const payments = await this.findAll();
    return payments.filter((payment) => payment.user_id === userId);
  }

  async findBySellerId(sellerId: string): Promise<PaymentInterface[]> {
    const payments = await this.findAll();
    return payments.filter((payment) => payment.seller_id === sellerId);
  }

  async findBySessionId(sessionId: string): Promise<PaymentInterface | null> {
    const payments = await this.findAll();
    return payments.find((payment) => payment.session_id === sessionId) || null;
  }

  async update(id: string, payment: Partial<PaymentInterface>): Promise<void> {
    return this.firestoreService.updateDocument(
      DatabaseTables.PAYMENT,
      id,
      payment,
    );
  }

  async delete(id: string): Promise<void> {
    return this.firestoreService.deleteDocument(DatabaseTables.PAYMENT, id);
  }
}
