import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';

import { ProductService } from './product.service';

@Controller('api/v1/product')
export class ProductController {
  constructor(private service: ProductService) {}

  /**
   * Creates a new product using CSV data.
   *
   * @returns {Promise<{}>} - Promise that resolves to the response object.
   *
   * @example
   * * Request
   * POST /api/v1/product
   *
   * * Response
   * {
   *  "success": true,
   *  "message": {...}
   * }
   */
  @Post()
  async importProducts(): Promise<{}> {
    console.log('Importing the Products FromCSV');

    const response = await this.service.importProducts();
    return {
      success: true,
      message: response,
    };
  }

  /**
   * Retrieves all products.
   *
   * @returns {Promise<{}>} - Promise that resolves to the response object.
   *
   * @example
   * * Request
   * GET /api/v1/product
   *
   * * Response
   * {
   *   "success": true,
   *   "data": {...}
   * }
   */
  @Get(':id')
  async getProduct(@Param('id') productId: string): Promise<{}> {
    const product = await this.service.getProduct(productId);
    return { success: true, data: product };
  }

  /**
   * Retrieves all products.
   *
   * @returns {Promise<{}>} - Promise that resolves to the response object.
   *
   * @example
   * * Request
   * GET /api/v1/product
   *
   * * Response
   * {
   *   "success": true,
   *   "data": [...]
   * }
   */
  @Get()
  async getAllProducts(): Promise<{}> {
    const products = await this.service.getProducts();
    return { success: true, data: products };
  }

  /**
   * Updates an existing product.
   *
   * @param {string} productId - Unique identifier of the product to be updated.
   * @param {any} updatedData - Updated data for the product.
   * @returns {Promise<{}>} - Promise that resolves to the response object.
   *
   * @example
   * * Request
   * PATCH /api/v1/product/:id
   * Body: Updated product data
   *
   * * Response
   * {
   *   "status": 200,
   *   "message": "product updated successfuly"
   * }
   */
  @Patch(':id')
  async updateProduct(
    @Param('id') productId: string,
    @Body() updatedData: any,
  ): Promise<{}> {
    const response = await this.service.updateProducts(productId, updatedData);
    return {
      success: true,
      message: response,
    };
  }

  /**
   * Deletes a product.
   *
   * @param {string} productId - Unique identifier of the product to be deleted.
   * @returns {Promise<{}>} - Promise that resolves to the response object.
   *
   * @example
   * * Request
   * DELETE /api/v1/product/:id
   *
   * * Response
   * {
   *   "success": true,
   *   "data": {...}
   * }
   */
  @Delete(':id')
  async deleteProduct(@Param('id') productId: string): Promise<{}> {
    const response = await this.service.deleteProducts(productId);
    return {
      success: true,
      message: response,
    };
  }
}
