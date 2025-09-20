import { Resolver, Query, Mutation, Args, ID, Int, Subscription } from '@nestjs/graphql';
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
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { PubserviceService } from 'src/pubservice/pubservice.service';
import { Notification } from 'src/notification/notification.entity';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private productsService: ProductsService, private readonly pubSubService:PubserviceService ) {}

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
    @Args('images', { type: () => [GraphQLUpload] , nullable: true}) images: Promise<FileUpload[]>,
    
  ): Promise<Product> {
    return this.productsService.createProduct(input,images);
  }
    @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async updatePriceTier(
    @Args('id') id: string,
    @Args('pricePerUnit',{nullable:true}) pricePerUnit: number,
    @Args('minQuantity',{nullable:true}) minQuantity: number,
    
  ): Promise<boolean> {
    return this.productsService.updatePriceTier(id,minQuantity,pricePerUnit);
  }
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deletePriceTier(
    @Args('id') id: string,    
  ): Promise<boolean> {
    return this.productsService.deletePriceTier(id);
  }

@UseGuards(JwtAuthGuard)
@Mutation(() => [Product]) // Changed to return array
async createMultipleProducts(
  @Args('input', { type: () => [CreateProductInput] }) input: CreateProductInput[],
): Promise<Product[]> {
  return this.productsService.createMultipleProducts(input);
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
   @Subscription(() => Notification, {
          filter: (payload) => {
              // The filter should return true to allow the notification through
                                    console.log('Subscription filter payload:222',payload);

              return Boolean(payload.broadcastNotification);
          },
          // Optionally resolve the payload if needed
          resolve: (payload) => {
              return payload.broadcastNotification;
                                    console.log('Subscription filter payload:1111',payload);

          }
      })
      async broadcastNotification() {
                      console.log('Subscription filter payload:');
  
          return this.pubSubService.asyncIterator('broadcastNotification');
      }
}
