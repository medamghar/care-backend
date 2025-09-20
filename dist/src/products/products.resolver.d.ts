import { ProductsService } from './products.service';
import { Product, ProductConnection, CreateProductInput, UpdateProductInput, ProductFilters } from './dto/product.dto';
import { Category } from '../categories/dto/category.dto';
import { Brand } from '../brands/dto/brand.dto';
import { FileUpload } from 'graphql-upload-ts';
import { PubserviceService } from 'src/pubservice/pubservice.service';
export declare class ProductsResolver {
    private productsService;
    private readonly pubSubService;
    constructor(productsService: ProductsService, pubSubService: PubserviceService);
    products(filters?: ProductFilters): Promise<ProductConnection>;
    GetProductById(id: string): Promise<Product>;
    featuredProducts(limit: number): Promise<Product[]>;
    searchProducts(query: string, limit: number): Promise<any[]>;
    categories(): Promise<Category[]>;
    category(id: string): Promise<any>;
    brands(): Promise<Brand[]>;
    brand(id: string): Promise<any>;
    createProduct(input: CreateProductInput, images: Promise<FileUpload[]>): Promise<Product>;
    updatePriceTier(id: string, pricePerUnit: number, minQuantity: number): Promise<boolean>;
    deletePriceTier(id: string): Promise<boolean>;
    createMultipleProducts(input: CreateProductInput[]): Promise<Product[]>;
    updateProduct(id: string, input: UpdateProductInput): Promise<Product>;
    deleteProduct(id: string): Promise<boolean>;
    addProductImage(productId: string, imageUrl: string, isPrimary: boolean): Promise<boolean>;
    addPriceTier(productId: string, minQuantity: number, pricePerUnit: number): Promise<boolean>;
    updateStock(productId: string, quantity: number, operation: 'add' | 'subtract'): Promise<any>;
    broadcastNotification(): Promise<AsyncIterator<unknown, any, any>>;
}
