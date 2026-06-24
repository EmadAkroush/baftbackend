import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { ProductsService } from './products.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { FilesInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import type { File as MulterFile } from 'multer';

import { extname } from 'path';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/products',

        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);

          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @UploadedFiles()
    files: MulterFile[],

    @Body()
    createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(createProductDto, files);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('featured')
  getFeaturedProducts() {
    return this.productsService.getFeaturedProducts();
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.productsService.findByCategory(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
