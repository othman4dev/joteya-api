import { Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from '../repositories/cart.repository';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ProductRepository } from '../repositories/product.repository';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(createCartDto: CreateCartDto) {
    const product = await this.productRepository.findById(
      createCartDto.product_id,
    );

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${createCartDto.product_id} not found`,
      );
    }

    if (product.quantity < createCartDto.quantity) {
      throw new Error('Not enough stock');
    }

    const user = await this.userRepository.findById(createCartDto.user_id);
    if (!user) {
      throw new NotFoundException(
        `User with ID ${createCartDto.user_id} not found`,
      );
    }

    const cartExists = await this.cartRepository.findByUserIdAndProductId(
      createCartDto.user_id,
      createCartDto.product_id,
    );

    if (cartExists) {
      throw new Error('Product already in cart');
    }

    const cart = {
      ...createCartDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const created = await this.cartRepository.create(cart);
    return { id: created, message: 'Items added to cart', status: 201 };
  }

  async findAll() {
    return this.cartRepository.findAll();
  }

  async findOne(id: string) {
    const cart = await this.cartRepository.findById(id);
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return cart;
  }

  async findByUserId(userId: string) {
    return this.cartRepository.findByUserId(userId);
  }

  async getCartWithProducts(user_id: string) {
    const cart = await this.findByUserId(user_id);
    const products = await Promise.all(
      cart.map(async (item) => {
        const product = await this.productRepository.findById(item.product_id);
        return { ...item, product };
      }),
    );
    return products;
  }

  async update(id: string, updateCartDto: UpdateCartDto) {
    const cart = await this.findOne(id);
    const updatedCart = {
      ...updateCartDto,
      updatedAt: new Date(),
    };
    return this.cartRepository.update(id, updatedCart);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.cartRepository.delete(id);
  }
}
