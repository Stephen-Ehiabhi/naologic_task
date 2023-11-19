import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ParserService } from '../util/parser/parser.service';
import { EnhancementService } from '../util/enhancement/enhancement.service';
import { HttpModule } from '@nestjs/axios';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Product,
  ProductSchema,
  Variant,
  VariantSchema,
} from 'src/product/model.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Variant.name, schema: VariantSchema },
    ]),
    HttpModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ParserService, EnhancementService],
  exports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Variant.name, schema: VariantSchema },
    ]),
    ProductService
  ],
})
export class ProductModule {}
