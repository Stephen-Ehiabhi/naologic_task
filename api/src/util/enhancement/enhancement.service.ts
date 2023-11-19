import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

/**
 * The `EnhancementService` class is responsible for enhancing product descriptions
 * using an AI-powered language model, specifically GPT-4. It utilizes the `HttpService`
 * from NestJS to make requests to the GPT-4 API and enhance product descriptions
 * based on a given input prompt.
 *
 * @class EnhancementService
 * @constructor
 * @param {HttpService} http - The NestJS `HttpService` instance to make HTTP requests.
 */
@Injectable()
export class EnhancementService {
  /**
   * Constructs an instance of the `EnhancementService`.
   *
   * @constructor
   * @param {HttpService} http - The NestJS `HttpService` instance to make HTTP requests.
   */
  constructor(private readonly http: HttpService) {}

  /**
   * Enhances the given product description using the GPT-4 language model.
   *
   * @method enhanceDescription
   * @async
   * @param {String} name - The name of the product.
   * @param {String} description - The existing description of the product.
   * @param {String} category - The category to which the product belongs.
   * @returns {Promise<string>} - A Promise that resolves to the enhanced product description.
   */
  async enhanceDescription(
    name: String,
    description: String,
    category: String,
  ): Promise<string> {
    // Construct an input prompt for GPT-4 based on product information.
    const inputPrompt = `You are an expert in medical sales. Your specialty is medical consumables used by hospitals on a daily basis.
    Product Name: ${name}
    Product Description: ${description}
    Category: ${category}

    New Description: `;

    // Generate the enhanced product description using GPT-4.
    return await this.generateDescriptionWithGPT4(inputPrompt);
  }

  /**
   * Generates an enhanced product description using the GPT-4 language model.
   *
   * @method generateDescriptionWithGPT4
   * @private
   * @async
   * @param {string} prompt - The input prompt for GPT-4.
   * @returns {Promise<string>} - A Promise that resolves to the enhanced product description.
   * @throws {Error} - Throws an error if there's an issue with the GPT-4 API request.
   */
  private async generateDescriptionWithGPT4(prompt: string): Promise<string> {
    try {
      // Make a POST request to the GPT-4 API with the input prompt.
      const response = await this.http.axiosRef.post(
        process.env.OPENAPI_URL,
        { prompt },
        { headers: { Authorization: `Bearer ${process.env.OPENAPI_API}` } },
      );

       //I dont have GPT key, so i just looked up some examples

      // Return the generated enhanced product description.
      return response.data.choices[0]?.text;
    } catch (error) {

      console.error(
        'Error generating enhanced description with GPT-4:',
        error.message,
      );
      throw new Error('Error generating enhanced description with GPT-4.');
    }
  }
}
