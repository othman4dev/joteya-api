import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductRepository } from '../repositories/product.repository';
import { FirestoreModule } from '../firestore/firestore.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [FirestoreModule, UploadModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
