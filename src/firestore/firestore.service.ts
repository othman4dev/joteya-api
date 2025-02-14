import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import serviceAccount from '../config/firestore/secret.json';
import { ConfigService } from '@nestjs/config';
import { FieldValue } from 'firebase-admin/firestore';
import { DatabaseTables } from 'src/enums/database-tables.enum';
import { firestore } from 'firebase-admin';

@Injectable()
export class FirestoreService {
  private db: admin.firestore.Firestore;

  constructor(private configService: ConfigService) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      databaseURL: this.configService.get<string>('FIRESTORE_DATABASE_URL'),
    });
    this.db = admin.firestore();
  }

  async getAllDocuments(collection: DatabaseTables): Promise<any[]> {
    const snapshot = await this.db.collection(collection).get();
    return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  }

  async getDocument(collection: DatabaseTables, id: string): Promise<any> {
    const doc = await this.db.collection(collection).doc(id).get();
    return doc.exists ? { ...doc.data(), id: doc.id } : null;
  }

  async addDocument(collection: DatabaseTables, data: any): Promise<string> {
    const doc = {
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    const docRef = await this.db.collection(collection).add(doc);
    return docRef.id;
  }

  async updateDocument(
    collection: DatabaseTables,
    id: string,
    data: any,
  ): Promise<void> {
    await this.db
      .collection(collection)
      .doc(id)
      .update({
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      });
  }

  async deleteDocument(collection: DatabaseTables, id: string): Promise<void> {
    await this.db.collection(collection).doc(id).delete();
  }

  async removeField(docPath: string, fieldName: string) {
    const docRef = this.db.doc(docPath);
    await docRef.update({
      [fieldName]: firestore.FieldValue.delete(),
    });
  }
}
