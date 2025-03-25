import {
  Injectable,
  Inject,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileUploadService } from '../upload/upload.service';

@Injectable({ scope: Scope.REQUEST })
export class ProductsService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly fileUploadService: FileUploadService,
    @Inject(REQUEST) private readonly request: Request,
  ) { }

  async create(productData: CreateProductDto, files: Express.Multer.File[]) {
    if (!this.request['authentificated']) {
      throw new UnauthorizedException(
        'You need authentication to create a product',
      );
    }
    if (productData.userId !== this.request['user'].id) {
      throw new UnauthorizedException(
        'You can only create a product for yourself',
      );
    }

    // Upload images and get their paths
    const imagePaths = await this.fileUploadService.saveImages(files);

    // Add image paths to the product data
    const productDataHere = {
      ...productData,
      images: imagePaths,
    };

    //remove the key productImages from the object
    delete productDataHere.productImages;

    // Use productData instead of productData to include the image paths
    const created = await this.productRepository.create(productDataHere);

    if (created) {
      return {
        message: 'Product created successfully',
        data: created,
        status: 201,
        product: await this.productRepository.findById(created),
      };
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return this.productRepository.update(id, updateProductDto);
  }

  async remove(id: string) {
    // Check if the user is authenticated
    if (!this.request['authentificated']) {
      throw new UnauthorizedException(
        'You need authentication to delete a product',
      );
    }
    // const token = this.request.headers.authorization.split(' ')[1];

    return this.productRepository.delete(id);
  }

  async findAll() {
    return this.productRepository.findAll();
  }

  async findById(id: string) {
    return this.productRepository.findById(id);
  }

  async findByCategory(category: string) {
    return this.productRepository.findByCategory(category);
  }

  async findByPrice(price: number) {
    return this.productRepository.findByPrice(price);
  }

  async removeField(table: string, field: string) {
    return this.productRepository.removeField(table, field);
  }

  async findBySeller(sellerId: string) {
    return this.productRepository.findBySeller(sellerId);
  }

  async findByStatus(status: string) {
    return this.productRepository.findByStatus(status);
  }

  async findByAuthenticity(authenticity: string) {
    return this.productRepository.findByAuthenticity(authenticity);
  }

  async findByCondition(condition: string) {
    return this.productRepository.findByCondition(condition);
  }

  async findByDescription(description: string) {
    return this.productRepository.findByDescription(description);
  }

  async findByName(name: string) {
    return this.productRepository.findByName(name);
  }
}
