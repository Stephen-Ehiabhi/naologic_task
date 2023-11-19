// product.Schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;
export type VariantDocument = HydratedDocument<Variant>;

@Schema()
export class Variant {
  @Prop({ type: String, default: () => generateNanoid(), index: true })
  id: string;

  @Prop({ type: Boolean, default: true })
  available: boolean;

  @Prop({ type: [] })
  attributes: [];

  @Prop({ type: Number, default: 12 })
  cost: number;

  @Prop({ type: String, default: 'USD' })
  currency: string;

  @Prop({ type: Number })
  depth: number;

  @Prop({ type: Number })
  width: number;

  @Prop({ type: Number })
  height: number;

  @Prop({ type: String })
  dimensionUom: string;

  @Prop({ type: Number })
  volume: number;

  @Prop({ type: String })
  volumeUom: string;

  @Prop({ type: Number })
  weight: number;

  @Prop({ type: String })
  weightUom: string;

  @Prop({ type: String })
  manufacturerItemCode: string;

  @Prop({ type: String, default: '' })
  packaging: string;

  @Prop({ type: Number })
  price: number;

  @Prop({ type: String })
  sku: string;

  @Prop({ type: Boolean, default: true })
  active: boolean;

  @Prop({ type: [] })
  images: [];

  @Prop({ type: String })
  itemCode: string;
}


@Schema()
export class Product {
  @Prop({ type: String, default: '' , index: true })
  productId: string;

  @Prop({ type: String, default: () => generateNanoid() })
  docId: string;

  @Prop({ type: String, default: '' })
  productName: string;

  @Prop({ type: Object })
  data: {
    name: string;
    type: string;
    shortDescription: string;
    description: string;
    vendorId: string;
    manufacturerId: string;
    storefrontPriceVisibility: string;
    variants: Variant[];
    options: [],
  };

  @Prop({ type: String })
  availability: string;

  @Prop({ type: Boolean, default: false })
  isFragile: boolean;

  @Prop({ type: String, default: 'published' })
  published: string;

  @Prop({ type: Boolean, default: true })
  isTaxable: boolean;

  @Prop({ type: Date, default: () => new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: () => new Date() })
  updatedAt: Date;

  @Prop({ type: Number, default: 0 })
  quantityOnHand: Number;

  @Prop({ type: Boolean, default: false })
  enhancedDescription: Boolean;

  @Prop({ type: Boolean, default: false })
  deleted: Boolean;

  @Prop({ type: [Variant] })
  variants: Variant[];

  @Prop({ type: String })
  categoryName: String;
  
  @Prop({ type: [] })
  options: [];
}

async function generateNanoid(): Promise<string> {
  const { nanoid } = await import('nanoid');
  return nanoid();
}

export const ProductSchema = SchemaFactory.createForClass(Product);
export const VariantSchema = SchemaFactory.createForClass(Variant);