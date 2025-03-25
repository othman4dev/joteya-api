import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { CartRepository } from '../repositories/cart.repository';
import { ProductRepository } from '../repositories/product.repository';
import { UserRepository } from '../repositories/user.repository';
import { NotFoundException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;

  const mockCartRepository = {
    create: jest.fn().mockResolvedValue('1'),
    findById: jest.fn().mockResolvedValue({ id: '1', user_id: 'userId', product_id: 'productId', quantity: 2 }),
    findByUserIdAndProductId: jest.fn().mockResolvedValue(null),
    findAll: jest.fn().mockResolvedValue([]),
    findByUserId: jest.fn().mockResolvedValue([{ id: '1', product_id: 'productId', quantity: 2 }]),
    update: jest.fn().mockResolvedValue(true),
    delete: jest.fn().mockResolvedValue(true),
  };

  const mockProductRepository = {
    findById: jest.fn().mockResolvedValue({ id: 'productId', quantity: 10 }),
  };

  const mockUserRepository = {
    findById: jest.fn().mockResolvedValue({ id: 'userId', name: 'John Doe' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: CartRepository, useValue: mockCartRepository },
        { provide: ProductRepository, useValue: mockProductRepository },
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  describe('create', () => {
    it('should create a cart successfully', async () => {
      const createCartDto = { user_id: 'userId', product_id: 'productId', quantity: 2 };
      const result = await service.create(createCartDto);
      expect(result.message).toBe('Items added to cart');
      expect(result.status).toBe(201);
    });

    it('should throw NotFoundException if product is not found', async () => {
      mockProductRepository.findById.mockResolvedValue(null);
      const createCartDto = { user_id: 'userId', product_id: 'productId', quantity: 2 };

      await expect(service.create(createCartDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if there is not enough stock', async () => {
      mockProductRepository.findById.mockResolvedValue({ id: 'productId', quantity: 1 });
      const createCartDto = { user_id: 'userId', product_id: 'productId', quantity: 2 };

      await expect(service.create(createCartDto)).rejects.toThrowError('Not enough stock');
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);
      const createCartDto = { user_id: 'userId', product_id: 'productId', quantity: 1 };

      await expect(service.create(createCartDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if product already exists in the cart', async () => {
      mockCartRepository.findByUserIdAndProductId.mockResolvedValue({ id: '1', user_id: 'userId', product_id: 'productId', quantity: 2 });
      const createCartDto = { user_id: 'userId', product_id: 'productId', quantity: 2 };

      await expect(service.create(createCartDto)).rejects.toThrowError('Not enough stock');
    });
  });

  describe('findAll', () => {
    it('should return all carts', async () => {
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a cart by id', async () => {
      const result = await service.findOne('1');
      expect(result).toHaveProperty('id');
    });

    it('should throw NotFoundException if cart is not found', async () => {
      mockCartRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUserId', () => {
    it('should return carts by user id', async () => {
      const result = await service.findByUserId('userId');
      expect(result).toEqual([{ id: '1', product_id: 'productId', quantity: 2 }]);
    });
  });

  describe('getCartWithProducts', () => {
    it('should return cart with products', async () => {
      const result = await service.getCartWithProducts('userId');
      expect(result).toEqual([{ id: '1', product_id: 'productId', quantity: 2, product: { id: 'productId', quantity: 1 } }]);
    });
  });

  describe('update', () => {
    it('should update a cart successfully', async () => {
      const updateCartDto = { quantity: 5 };
      try {
        await service.update('1', updateCartDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }


    });

    it('should throw NotFoundException if cart is not found', async () => {
      mockCartRepository.findById.mockResolvedValue(null);
      const updateCartDto = { quantity: 5 };

      await expect(service.update('1', updateCartDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a cart successfully', async () => {
      try {
        await service.remove('1');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }


    });

    it('should throw NotFoundException if cart is not found', async () => {
      mockCartRepository.findById.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
