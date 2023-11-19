import { Product } from '../model.schema';

export interface ProductServiceDesign {
  getProducts(): Promise<Product[]>;
  getProduct(productId: string): Promise<Product>;
  importProducts(): Promise<String>;
  updateProducts(
    productId: string,
    updatedData: Partial<Product>,
  ): Promise<String>;
  deleteProducts(productId: string): Promise<String>;
}
