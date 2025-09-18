import { ObjectType, Field, ID, InputType, Int, Float } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
} from 'class-validator';
import { Category } from '../../categories/dto/category.dto';
import { Brand } from '../../brands/dto/brand.dto';

@ObjectType()
export class ProductImage {
  @Field(() => ID)
  id: string;

  @Field()
  imageUrl: string;

  @Field(() => Int)
  sortOrder: number;

  @Field()
  isPrimary: boolean;
}

@ObjectType()
export class PriceTier {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  minQuantity: number;

  @Field(() => Float)
  pricePerUnit: number;
}

@ObjectType()
export class Product {
  @Field(() => ID)
  id: string;

  @Field()
  sku: string;

  @Field()
  nameAr: string;

  @Field()
  nameFr: string;

  @Field({ nullable: true })
  descriptionAr?: string;

  @Field({ nullable: true })
  descriptionFr?: string;

  @Field(() => Float)
  basePrice: number;

  @Field(() => Int)
  currentStock: number;

  @Field()
  isFeatured: boolean;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Category)
  category: Category;

  @Field(() => Brand)
  brand: Brand;

  @Field(() => [ProductImage])
  images: ProductImage[];

  @Field(() => [PriceTier])
  priceTiers: PriceTier[];
}

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  sku: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  nameFr: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descriptionFr?: string;

  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  brandId: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  basePrice: number;

  @Field(() => Int)
  @IsNumber()
  @Min(0)
  currentStock: number;

  @Field({ defaultValue: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @Field({ defaultValue: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nameAr?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nameFr?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descriptionAr?: string;


  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  brandId?: string;


  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descriptionFr?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentStock?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@InputType()
export class CreateCategoryInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  nameFr: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  parentId?: string;

  @Field(() => Int, { defaultValue: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

@InputType()
export class CreateBrandInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  logoUrl: string;
}

@ObjectType()
export class ProductConnection {
  @Field(() => [Product])
  products: Product[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field()
  hasMore: boolean;
}

@InputType()
export class ProductFilters {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  brandId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @Field(() => Int, { defaultValue: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @Field(() => Int, { defaultValue: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;
}
