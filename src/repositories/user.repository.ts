import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../firestore/firestore.service';
import { DatabaseTables } from '../enums/database-tables.enum';
import { UserInterface } from '../interfaces/user.interface';

@Injectable()
export class UserRepository {
  constructor(private readonly firestoreService: FirestoreService) {}

  async create(user: UserInterface): Promise<string> {
    return this.firestoreService.addDocument(DatabaseTables.USER, user);
  }

  async findAll(): Promise<UserInterface[]> {
    return this.firestoreService.getAllDocuments(
      DatabaseTables.USER,
    ) as Promise<UserInterface[]>;
  }

  async findById(id: string): Promise<UserInterface | null> {
    return this.firestoreService.getDocument(
      DatabaseTables.USER,
      id,
    ) as Promise<UserInterface | null>;
  }

  async findByEmail(email: string): Promise<UserInterface | null> {
    return (await this.findAll()).find((user) => user.email === email) || null;
  }

  async update(id: string, user: Partial<UserInterface>): Promise<void> {
    return this.firestoreService.updateDocument(DatabaseTables.USER, id, user);
  }

  async delete(id: string): Promise<void> {
    return this.firestoreService.deleteDocument(DatabaseTables.USER, id);
  }

  async removeField(table: string, field: string) {
    return this.firestoreService.removeField(table, field);
  }
}
