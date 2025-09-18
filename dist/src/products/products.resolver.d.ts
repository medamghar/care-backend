import { ProductsService } from './products.service';
import { Product, ProductConnection, CreateProductInput, UpdateProductInput, ProductFilters } from './dto/product.dto';
import { Category } from '../categories/dto/category.dto';
import { Brand } from '../brands/dto/brand.dto';
export declare class ProductsResolver {
    private productsService;
    constructor(productsService: ProductsService);
    products(filters?: ProductFilters): Promise<ProductConnection>;
    GetProductById(id: string): Promise<Product>;
    featuredProducts(limit: number): Promise<Product[]>;
    searchProducts(query: string, limit: number): Promise<any[]>;
    categories(): Promise<Category[]>;
    category(id: string): Promise<any>;
    brands(): Promise<Brand[]>;
    brand(id: string): Promise<any>;
    createProduct(input: CreateProductInput): Promise<Product>;
    updateProduct(id: string, input: UpdateProductInput): Promise<Product>;
    deleteProduct(id: string): Promise<boolean>;
    addProductImage(productId: string, imageUrl: string, isPrimary: boolean): Promise<boolean>;
    addPriceTier(productId: string, minQuantity: number, pricePerUnit: number): Promise<boolean>;
    updateStock(productId: string, quantity: number, operation: 'add' | 'subtract'): Promise<any>;
}
