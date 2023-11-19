import { Injectable } from '@nestjs/common';
import { Transform } from 'stream';
import * as csvParser from 'csv-parser';
import { createReadStream } from 'fs';
import { Product } from '../../product/model.schema.js';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

/**
 * The `ParserService` class is responsible for parsing CSV data, transforming it into a structured
 * JSON format, and saving it to a MongoDB database using the provided `ProductModel`. The parsing
 * process is carried out using a stream-based approach, ensuring efficient handling of large CSV files.
 *
 * @class ParserService
 * @constructor
 * @param {Model<Product>} productModel - The Mongoose model for the 'Product' schema.
 */
@Injectable()
export class ParserService {
  /**
   * Constructs an instance of the `ParserService`.
   *
   * @constructor
   * @param {Model<Product>} productModel - The Mongoose model for the 'Product' schema.
   */
  constructor(
    @InjectModel(Product.name, 'products') private productModel: Model<Product>,
  ) {}

  /**
   * Converts a CSV file to JSON format and saves the transformed data to the MongoDB database.
   * The process involves using a stream-based transformation and insertion into the database.
   *
   * @method convertFileToJsonAndSaveToDb
   * @async
   * @returns {Promise<void>} - A Promise that resolves once the conversion and saving are completed.
   * @throws {Error} - Throws an error if there's an issue with CSV parsing or database insertion.
   */
  async convertFileToJsonAndSaveToDb(): Promise<void> {
    // Set to keep track of unique keys and avoid duplicate entries.
    const uniqueKeys = new Set<string>();

    // transform stream for processing CSV data.
    const transformStream = new Transform({
      objectMode: true,
      transform: async (chunk, encoding, callback) => {
        try {
          // Transform each CSV row into a product object.
          const product = await this.transformRows(chunk, uniqueKeys);

          if (product) {
            // Insert the transformed product data into the MongoDB database.
            await this.productModel.insertMany(product);
            console.log(`Products saved to the database.`);
          }

          callback();
        } catch (error) {
          // Handle and log errors that occur during transformation or database insertion.
          console.error('Error transforming and saving data:', error);
          callback(error);
        }
      },
    });

    // Read the CSV file, parse it, and pipe it through the transform stream.
    return new Promise((resolve, reject) => {
      createReadStream('../../model/data/data.txt')
        .pipe(csvParser({ separator: '\t' }))
        .pipe(transformStream)
        .on('end', () => {
          console.log('CSV parsing and MongoDB saving completed.');
          resolve();
        })
        .on('error', (error) => {
          // Handle and log errors that occur during CSV parsing.
          console.error('Error parsing CSV:', error);
          reject(error);
        });
    });
  }

  /**
   * Transforms a CSV row into a structured product object, ensuring data integrity and avoiding duplicates.
   *
   * @method transformRows
   * @private
   * @async
   * @param {any} row - The CSV row to be transformed.
   * @param {Set<string>} uniqueKeys - A set to keep track of unique keys.
   * @returns {Promise<any | null>} - A Promise that resolves to the transformed product object or null if skipped.
   * @throws {Error} - Throws an error if there's an issue during transformation.
   */
  private async transformRows(
    row: any,
    uniqueKeys: Set<string>,
  ): Promise<any | null> {
    try {
      // Check if the row is valid and not a duplicate.
      if (this.isValidRow(row) && !this.isDuplicateRow(row, uniqueKeys)) {
        const uniqueKey = `${row.ManufacturerItemId}-${row.ProductID}-${row.PKG}`;

        uniqueKeys.add(uniqueKey);

        // Generate a structured product object.
        const product = {
          name: row.ProductName,
          type: row.type,
          shortDescription: row.shortDescription,
          description: row.ItemDescription,
          vendorId: row.vendorId,
          manufacturerId: row.ManufacturerItemId,
          storefrontPriceVisibility: row.storefrontPriceVisibility,
          categoryName: row.categoryName,
          variants: [
            {
              available: row.availbility,
              attributes: {
                packaging: row.PKG,
                description: row.ItemDescription,
              },
              cost: row.price,
              currency: row.currency,
              description: row.ItemDescription,
              packaging: row.PKG,
              price: row.price,
              sku: uniqueKey,
              images: [{ fileName: '', cdnLink: null, i: 0, alt: null }],
              itemCode: `HSI ${row.ManufacturerItemCode}`,
            },
          ],
        };

        return product;
      } else {
        return null; // Skip invalid or duplicate rows.
      }
    } catch (error) {
      // Handle and log errors that occur during row transformation.
      console.error('Error transforming row:', error);
      throw error;
    }
  }

  /**
   * Checks if a CSV row is valid based on specific criteria.
   *
   * @method isValidRow
   * @private
   * @param {Object} row - The CSV row to be validated.
   * @returns {boolean} - Returns true if the row is valid, false otherwise.
   */
  private isValidRow(row: {
    PKG: string;
    ProductID: string;
    ManufacturerItemId: string;
  }): boolean {
    return (
      row.PKG !== '' && row.ProductID !== '' && row.ManufacturerItemId !== ''
    );
  }

  /**
   * Checks if a CSV row is a duplicate based on a set of unique keys.
   *
   * @method isDuplicateRow
   * @private
   * @param {Object} row - The CSV row to check for duplicates.
   * @param {Set<string>} uniqueKeys - A set of unique keys to compare against.
   * @returns {boolean} - Returns true if the row is a duplicate, false otherwise.
   */
  private isDuplicateRow(
    row: { ManufacturerItemId: any; ProductID: any; PKG: any },
    uniqueKeys: Set<string>,
  ): boolean {
    const uniqueKey = `${row.ManufacturerItemId}${row.ProductID}${row.PKG}`;
    return uniqueKeys.has(uniqueKey);
  }
}
