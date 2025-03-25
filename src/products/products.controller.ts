import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  Put,
  Delete,
  Param,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Body('data') productData: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const product = JSON.parse(productData);
    return this.productsService.create(product, files);
  }

  @Get('')
  async findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() updateProductDto: any) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Get('category/:category')
  async findByCategory(@Param('category') category: string) {
    return this.productsService.findByCategory(category);
  }

  @Get('price/:price')
  async findByPrice(@Param('price') price: number) {
    return this.productsService.findByPrice(price);
  }

  @Get('seller/:sellerId')
  async findBySeller(@Param('sellerId') sellerId: string) {
    return this.productsService.findBySeller(sellerId);
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: string) {
    return this.productsService.findByStatus(status);
  }

  @Get('authenticity/:authenticity')
  async findByAuthenticity(@Param('authenticity') authenticity: string) {
    return this.productsService.findByAuthenticity(authenticity);
  }

  @Get('condition/:condition')
  async findByCondition(@Param('condition') condition: string) {
    return this.productsService.findByCondition(condition);
  }

  @Get('description/:description')
  async findByDescription(@Param('description') description: string) {
    return this.productsService.findByDescription(description);
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string) {
    return this.productsService.findByName(name);
  }
}
