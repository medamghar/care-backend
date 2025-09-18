import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  Product,
  ProductConnection,
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
} from './dto/product.dto';
import { Category } from '../categories/dto/category.dto';
import { Brand } from '../brands/dto/brand.dto';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private productsService: ProductsService) {}

  // Public Queries (for mobile app)
  @Query(() => ProductConnection)
  async products(
    @Args('filters', { nullable: true }) filters?: ProductFilters,
  ): Promise<ProductConnection> {
    return this.productsService.getProducts(filters || {});
  }

  @Query(() => Product)
  async GetProductById(@Args('id', { type: () => ID }) id: string): Promise<Product> {
    console.log('Fetching product with ID:', id);
    return this.productsService.getProduct(id);
  }

  @Query(() => [Product])
  async featuredProducts(
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<Product[]> {
    return this.productsService.getFeaturedProducts(limit);
  }

  @Query(() => [Product])
  async searchProducts(
    @Args('query') query: string,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
  ): Promise<any[]> {
    return this.productsService.searchProducts(query, limit);
  }

  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    return this.productsService.getCategories();
  }

  @Query(() => Category)
  async category(@Args('id', { type: () => ID }) id: string): Promise<any> {
    return this.productsService.getCategory(id);
  }

  @Query(() => [Brand])
  async brands(): Promise<Brand[]> {
    return this.productsService.getBrands();
  }

  @Query(() => Brand)
  async brand(@Args('id', { type: () => ID }) id: string): Promise<any> {
    return this.productsService.getBrand(id);
  }

  // Admin Mutations (protected)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Product)
  async createProduct(
    @Args('input') input: CreateProductInput,
  ): Promise<Product> {
    return this.productsService.createProduct(input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Product)
  async updateProduct(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateProductInput,
  ): Promise<Product> {
    return this.productsService.updateProduct(id, input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteProduct(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.productsService.deleteProduct(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async addProductImage(
    @Args('productId', { type: () => ID }) productId: string,
    @Args('imageUrl') imageUrl: string,
    @Args('isPrimary', { defaultValue: false }) isPrimary: boolean,
  ): Promise<boolean> {
    await this.productsService.addProductImage(productId, imageUrl, isPrimary);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async addPriceTier(
    @Args('productId', { type: () => ID }) productId: string,
    @Args('minQuantity') minQuantity: number,
    @Args('pricePerUnit') pricePerUnit: number,
  ): Promise<boolean> {
    await this.productsService.addPriceTier(
      productId,
      minQuantity,
      pricePerUnit,
    );
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Product)
  async updateStock(
    @Args('productId', { type: () => ID }) productId: string,
    @Args('quantity') quantity: number,
    @Args('operation', { defaultValue: 'add' }) operation: 'add' | 'subtract',
  ): Promise<any> {
    return this.productsService.updateStock(productId, quantity, operation);
  }
}
