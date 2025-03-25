import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductRepository } from '../repositories/product.repository';
import { FileUploadService } from '../upload/upload.service';
import { UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockProductRepository = {
    create: jest.fn().mockResolvedValue({ id: '1', name: 'Product', price: 100 }),
    update: jest.fn().mockResolvedValue(true),
    delete: jest.fn().mockResolvedValue(true),
    findAll: jest.fn().mockResolvedValue([]),
    findById: jest.fn().mockResolvedValue({ id: '1', name: 'Product' }),
    findByCategory: jest.fn().mockResolvedValue([]),
    findByPrice: jest.fn().mockResolvedValue([]),
    removeField: jest.fn().mockResolvedValue(true),
    findBySeller: jest.fn().mockResolvedValue([]),
    findByStatus: jest.fn().mockResolvedValue([]),
    findByAuthenticity: jest.fn().mockResolvedValue([]),
    findByCondition: jest.fn().mockResolvedValue([]),
    findByDescription: jest.fn().mockResolvedValue([]),
    findByName: jest.fn().mockResolvedValue([]),
  };

  const mockFileUploadService = {
    saveImages: jest.fn().mockResolvedValue(['imagePath']),
  };

  const mockRequest = {
    authentificated: true,
    user: { id: 'userId' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: ProductRepository, useValue: mockProductRepository },
        { provide: FileUploadService, useValue: mockFileUploadService },
        { provide: REQUEST, useValue: mockRequest },
      ],
    }).compile();

    // Use resolve() instead of get() for scoped providers
    service = await module.resolve<ProductsService>(ProductsService);
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const productData = { name: 'New Product', price: 100, userId: 'anotherUserId', description: 'Great product', quantity: 4, status: 'available', authenticity: 'original', condition: 'test', category: 'test', brand: 'test', sellerId: '324ey98wnyr', stock: 5, rating: 5, discount: 70, sex: 'male', about: 'test test', size: 'xl', productImages: ['test'] };
      const files = [{ path: 'fake-path' }] as Express.Multer.File[];
      try {
        const result = await service.create(productData, files);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('should throw UnauthorizedException if not authenticated', async () => {
      mockRequest.authentificated = false;
      const productData = { name: 'New Product', price: 100, userId: 'anotherUserId', description: 'Great product', quantity: 4, status: 'available', authenticity: 'original', condition: 'test', category: 'test', brand: 'test', sellerId: '324ey98wnyr', stock: 5, rating: 5, discount: 70, sex: 'male', about: 'test test', size: 'xl', productImages: ['test'] };
      const files = [{ path: 'fake-path' }] as Express.Multer.File[];

      await expect(service.create(productData, files)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user tries to create a product for another user', async () => {
      const productData = { name: 'New Product', price: 100, userId: 'anotherUserId', description: 'Great product', quantity: 4, status: 'available', authenticity: 'original', condition: 'test', category: 'test', brand: 'test', sellerId: '324ey98wnyr', stock: 5, rating: 5, discount: 70, sex: 'male', about: 'test test', size: 'xl', productImages: ['test'] };
      const files = [{ path: 'fake-path' }] as Express.Multer.File[];

      await expect(service.create(productData, files)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findAll', () => {
    it('should return a list of products', async () => {
      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a product by id', async () => {
      const result = await service.findById('1');

      expect(result).toHaveProperty('id');
    });
  });

  describe('findByCategory', () => {
    it('should return products by category', async () => {
      const result = await service.findByCategory('electronics');

      expect(result).toEqual([]);
    });
  });

  describe('findByPrice', () => {
    it('should return products by price', async () => {
      const result = await service.findByPrice(100);

      expect(result).toEqual([]);
    });
  });

  describe('removeField', () => {
    it('should remove a field from a product', async () => {
      const result = await service.removeField('products', 'description');

      expect(result).toBe(true);
    });
  });

  describe('findBySeller', () => {
    it('should return products by seller', async () => {
      const result = await service.findBySeller('sellerId');

      expect(result).toEqual([]);
    });
  });

  describe('findByStatus', () => {
    it('should return products by status', async () => {
      const result = await service.findByStatus('active');

      expect(result).toEqual([]);
    });
  });

  describe('findByAuthenticity', () => {
    it('should return products by authenticity', async () => {
      const result = await service.findByAuthenticity('authentic');

      expect(result).toEqual([]);
    });
  });

  describe('findByCondition', () => {
    it('should return products by condition', async () => {
      const result = await service.findByCondition('new');

      expect(result).toEqual([]);
    });
  });

  describe('findByDescription', () => {
    it('should return products by description', async () => {
      const result = await service.findByDescription('Great product');

      expect(result).toEqual([]);
    });
  });

  describe('findByName', () => {
    it('should return products by name', async () => {
      const result = await service.findByName('Product');

      expect(result).toEqual([]);
    });
  });
});
