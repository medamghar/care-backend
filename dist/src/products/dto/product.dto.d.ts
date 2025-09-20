import { Category } from '../../categories/dto/category.dto';
import { Brand } from '../../brands/dto/brand.dto';
export declare class ProductImage {
    id: string;
    imageUrl: string;
    sortOrder: number;
    isPrimary: boolean;
}
export declare class PriceTier {
    id: string;
    minQuantity: number;
    pricePerUnit: number;
}
export declare class Product {
    id: string;
    sku: string;
    nameAr: string;
    nameFr: string;
    descriptionAr?: string;
    descriptionFr?: string;
    basePrice: number;
    comparePrice: number;
    currentStock: number;
    isFeatured: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    category: Category;
    brand: Brand;
    images: ProductImage[];
    priceTiers: PriceTier[];
}
export declare class CreateProductInput {
    sku: string;
    nameAr: string;
    nameFr: string;
    descriptionAr?: string;
    descriptionFr?: string;
    categoryId: string;
    brandId: string;
    basePrice: number;
    comparePrice: number;
    currentStock: number;
    isFeatured?: boolean;
    isActive?: boolean;
    imageUrl?: string;
}
export declare class UpdateProductInput {
    nameAr?: string;
    nameFr?: string;
    descriptionAr?: string;
    brandId?: string;
    categoryId?: string;
    descriptionFr?: string;
    basePrice?: number;
    currentStock?: number;
    isFeatured?: boolean;
    isActive?: boolean;
    comparePrice: number;
}
export declare class CreateCategoryInput {
    nameAr: string;
    nameFr: string;
    imageUrl: string;
    parentId?: string;
    sortOrder?: number;
}
export declare class CreateBrandInput {
    name: string;
    logoUrl: string;
}
export declare class ProductConnection {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}
export declare class ProductFilters {
    search?: string;
    categoryId?: string;
    brandId?: string;
    isFeatured?: boolean;
    inStock?: boolean;
    page?: number;
    limit?: number;
}
