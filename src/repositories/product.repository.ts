import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../firestore/firestore.service';
import { DatabaseTables } from '../enums/database-tables.enum';
import { ProductInterface } from '../interfaces/product.interface';
import { UserInterface } from '../interfaces/user.interface';

@Injectable()
export class ProductRepository {
  constructor(private readonly firestoreService: FirestoreService) {}

  async create(product: ProductInterface): Promise<string> {
    return this.firestoreService.addDocument(DatabaseTables.PRODUCT, product);
  }

  async findAll(): Promise<ProductInterface[]> {
    try {
      const productsRaw = await this.firestoreService.getAllDocuments(
        DatabaseTables.PRODUCT,
      );

      // Ensure `products` is always an array
      let products = Array.isArray(productsRaw) ? productsRaw : [productsRaw];

      if (products.length === 0) {
        return [];
      }

      const sellerIds = [
        ...new Set(
          products
            .filter(
              (product) => product.userId && typeof product.userId === 'string',
            )
            .map((product) => product.userId),
        ),
      ];

      if (sellerIds.length === 0) {
        return products;
      }

      const sellers = (
        await Promise.all(
          sellerIds.map(async (id) => {
            try {
              return await this.firestoreService.getDocument(
                DatabaseTables.USER,
                id,
              );
            } catch (error) {
              console.error(`Error fetching seller ${id}:`, error);
              return null;
            }
          }),
        )
      ).filter((seller) => seller !== null) as UserInterface[];

      const sellerMap = new Map(sellers.map((seller) => [seller.id, seller]));

      products = products.map((product) => ({
        ...product,
        seller: product.userId ? sellerMap.get(product.userId) || null : null,
      }));

      return products;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<ProductInterface | null> {
    const product = (await this.firestoreService.getDocument(
      DatabaseTables.PRODUCT,
      id,
    )) as ProductInterface;

    if (!product) return null;

    const seller = (await this.firestoreService.getDocument(
      DatabaseTables.USER,
      product.userId,
    )) as UserInterface;

    return {
      ...product,
      user: seller,
    };
  }

  async update(id: string, product: Partial<ProductInterface>): Promise<void> {
    return this.firestoreService.updateDocument(
      DatabaseTables.PRODUCT,
      id,
      product,
    );
  }

  async delete(id: string): Promise<void> {
    return this.firestoreService.deleteDocument(DatabaseTables.PRODUCT, id);
  }

  async removeField(table: string, field: string) {
    return this.firestoreService.removeField(table, field);
  }

  async findByCategory(category: string): Promise<ProductInterface[] | null> {
    return (
      (await this.findAll()).filter(
        (product) => product.category === category,
      ) || null
    );
  }

  async findByPrice(price: number): Promise<ProductInterface[] | null> {
    return (
      (await this.findAll()).filter((product) => product.price === price) ||
      null
    );
  }

  async findByDescription(
    description: string,
  ): Promise<ProductInterface[] | null> {
    return (
      (await this.findAll()).filter(
        (product) => product.description === description,
      ) || null
    );
  }

  async findByName(name: string): Promise<ProductInterface[] | null> {
    return (
      (await this.findAll()).filter((product) => product.name === name) || null
    );
  }

  async findBySeller(sellerId: string): Promise<ProductInterface[] | null> {
    return (
      (await this.findAll()).filter((product) => product.userId === sellerId) ||
      null
    );
  }

  async findByStatus(status: string): Promise<ProductInterface[] | null> {
    return (
      (await this.findAll()).filter((product) => product.status === status) ||
      null
    );
  }

  async findByAuthenticity(
    authenticity: string,
  ): Promise<ProductInterface[] | null> {
    return (
      (await this.findAll()).filter(
        (product) => product.authenticity === authenticity,
      ) || null
    );
  }

  async findByCondition(condition: string): Promise<ProductInterface[] | null> {
    return (
      (await this.findAll()).filter(
        (product) => product.condition === condition,
      ) || null
    );
  }

  async findBySex(sex: string): Promise<ProductInterface[] | null> {
    return (
      (await this.findAll()).filter((product) => product.sex === sex) || null
    );
  }

  async findBySize(size: string): Promise<ProductInterface[] | null> {
    return (
      (await this.findAll()).filter((product) => product.size === size) || null
    );
  }

  async findByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<ProductInterface[] | null> {
    return (
      (await this.findAll()).filter(
        (product) => product.price >= minPrice && product.price <= maxPrice,
      ) || null
    );
  }
}
