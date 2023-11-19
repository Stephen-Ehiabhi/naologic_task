import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ParserService } from '../util/parser/parser.service';
import { ProductServiceDesign } from './interface/product.service.interface';
import { Product } from './model.schema';
import { EnhancementService } from '../util/enhancement/enhancement.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ProductService implements ProductServiceDesign {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly parser: ParserService,
    private readonly enhancement: EnhancementService,
  ) {}

  /**
   * Inserts products into the database by parsing CSV data.
   *
   * @returns {Promise<string>} A message indicating the success of the operation.
   * @throws {BadRequestException} Throws if there's an error during the insertion.
   */

  /**
   * Scheduled task to run every day at midnight.
   */
  @Cron('0 0 * * *')
  async importProducts(): Promise<string> {
    try {
      console.log('Converting File to JSON');
      //convert csv file to json
      await this.parser.convertFileToJsonAndSaveToDb();

      const productDescriptionToEnhance = await this.productModel
        .find({ 'data.enhancedDescription': false })
        .limit(10);

      // Loop through each product and enhance its description
      for (const product of productDescriptionToEnhance) {
        const enhancedDescription = await this.enhancement.enhanceDescription(
          product.data.name,
          product.data.description,
          product.categoryName,
        );

        await this.productModel.updateOne(
          {
            _id: product._id,
            'data.variants.id': product.data.variants[0].id,
          },
          {
            $set: {
              'data.description': enhancedDescription,
              'data.enhancedDescription': true,
            },
          },
        );
      }
      console.log('10 products have been enhanced');

      return 'Products inserted successfully - :)';
    } catch (error) {
      console.error('Error inserting products:', error.message);
      throw new BadRequestException('Error inserting products');
    }
  }

  /**
   * Updates the data of an existing product in the database.
   *
   * @param {string} productId - Unique identifier of the product to be found.
   * @returns {Promise<any>} A found producst
   * @throws {NotFoundException} Throws if the product does not exist
   * @throws {BadRequestException} Throws if any other error occurs.
   */
  async getProduct(productId: string): Promise<Product> {
    try {
      const singleProduct = await this.productModel.findById(productId);

      if (!singleProduct) throw new NotFoundException('Product not found');

      return singleProduct;
    } catch (error) {
      console.error('Error getting a product:', error.message);
      throw new BadRequestException('Error getting product');
    }
  }

  /**
   * Retrieves all products from the database.
   *
   * @returns {Promise<Product[]>} Promise that resolves to an array of products.
   * @throws {BadRequestException} Throws if any error occurs during retrieval.
   */
  async getProducts(): Promise<Product[]> {
    try {
      const products = await this.productModel.find();
      return products;
    } catch (error) {
      console.error('Error retrieving products:', error.message);
      throw new BadRequestException('Error retrieving products');
    }
  }

  /**
   * Updates the data of an existing product in the database.
   *
   * @param {string} productId - Unique identifier of the product to be updated.
   * @param {Partial<Product>} updatedData - Object containing updated data for the product.
   * @returns {Promise<string>} A message indicating the success of the operation.
   * @throws {BadRequestException} Throws if the product does not exist or if any other error occurs.
   */
  async updateProducts(
    productId: string,
    updatedData: Partial<Product>,
  ): Promise<string> {
    try {
      const existingProduct = await this.productModel.findById(productId);

      if (!existingProduct) throw new NotFoundException('Product not found');

      await existingProduct.updateOne(updatedData);

      return `Product with ${existingProduct.id} was updated`;
    } catch (error) {
      console.error('Error updating product:', error.message);
      throw new BadRequestException('Error updating product');
    }
  }

  /**
   * Deletes a product from the database.
   *
   * @param {string} productId - Unique identifier of the product to be deleted.
   * @returns {Promise<string>} A message indicating the success of the operation.
   * @throws {NotFoundException} Throws if the product does not exist.
   * @throws {BadRequestException} Throws if orders are associated or if any other error occurs.
   */
  async deleteProducts(productId: string): Promise<string> {
    try {
      const existingProduct = await this.productModel.findById(productId);

      if (!existingProduct) throw new NotFoundException('Product not found');

      // Products you delete might already have orders. Decide what to do

      //i would have created a scheduler that checks the order delivery date, and based on that can set to active or not active
      if (!existingProduct.availability)
        throw new BadRequestException(
          'Cannot delete product with existing orders',
        );

      // Use Mongoose remove to delete an existing document
      await existingProduct.updateOne({ deleted: true });

      return `Product with ${existingProduct.id} is deleted`;
    } catch (error) {
      console.error('Error deleting product:', error.message);
      throw new BadRequestException('Error deleting product');
    }
  }
}
