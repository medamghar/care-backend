import { PrismaService } from '../prisma/prisma.service';
import { CreateProductInput, UpdateProductInput, CreateCategoryInput, CreateBrandInput, ProductFilters, ProductConnection } from './dto/product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    createProduct(input: CreateProductInput): Promise<{
        category: {
            id: string;
            nameAr: string;
            nameFr: string;
            imageUrl: string;
            parentId: string | null;
            sortOrder: number;
            isActive: boolean;
        };
        brand: {
            id: string;
            isActive: boolean;
            name: string;
            logoUrl: string;
        };
        images: {
            id: string;
            imageUrl: string;
            sortOrder: number;
            productId: string;
            isPrimary: boolean;
        }[];
        priceTiers: {
            id: string;
            productId: string;
            minQuantity: number;
            pricePerUnit: number;
        }[];
    } & {
        id: string;
        nameAr: string;
        nameFr: string;
        isActive: boolean;
        sku: string;
        descriptionAr: string | null;
        descriptionFr: string | null;
        categoryId: string;
        brandId: string;
        basePrice: number;
        currentStock: number;
        isFeatured: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProduct(id: string, input: UpdateProductInput): Promise<{
        category: {
            id: string;
            nameAr: string;
            nameFr: string;
            imageUrl: string;
            parentId: string | null;
            sortOrder: number;
            isActive: boolean;
        };
        brand: {
            id: string;
            isActive: boolean;
            name: string;
            logoUrl: string;
        };
        images: {
            id: string;
            imageUrl: string;
            sortOrder: number;
            productId: string;
            isPrimary: boolean;
        }[];
        priceTiers: {
            id: string;
            productId: string;
            minQuantity: number;
            pricePerUnit: number;
        }[];
    } & {
        id: string;
        nameAr: string;
        nameFr: string;
        isActive: boolean;
        sku: string;
        descriptionAr: string | null;
        descriptionFr: string | null;
        categoryId: string;
        brandId: string;
        basePrice: number;
        currentStock: number;
        isFeatured: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteProduct(id: string): Promise<boolean>;
    getProduct(id: string): Promise<{
        category: {
            id: string;
            nameAr: string;
            nameFr: string;
            imageUrl: string;
            parentId: string | null;
            sortOrder: number;
            isActive: boolean;
        };
        brand: {
            id: string;
            isActive: boolean;
            name: string;
            logoUrl: string;
        };
        images: {
            id: string;
            imageUrl: string;
            sortOrder: number;
            productId: string;
            isPrimary: boolean;
        }[];
        priceTiers: {
            id: string;
            productId: string;
            minQuantity: number;
            pricePerUnit: number;
        }[];
    } & {
        id: string;
        nameAr: string;
        nameFr: string;
        isActive: boolean;
        sku: string;
        descriptionAr: string | null;
        descriptionFr: string | null;
        categoryId: string;
        brandId: string;
        basePrice: number;
        currentStock: number;
        isFeatured: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getProducts(filters: ProductFilters): Promise<ProductConnection>;
    getFeaturedProducts(limit?: number): Promise<({
        category: {
            id: string;
            nameAr: string;
            nameFr: string;
            imageUrl: string;
            parentId: string | null;
            sortOrder: number;
            isActive: boolean;
        };
        brand: {
            id: string;
            isActive: boolean;
            name: string;
            logoUrl: string;
        };
        images: {
            id: string;
            imageUrl: string;
            sortOrder: number;
            productId: string;
            isPrimary: boolean;
        }[];
        priceTiers: {
            id: string;
            productId: string;
            minQuantity: number;
            pricePerUnit: number;
        }[];
    } & {
        id: string;
        nameAr: string;
        nameFr: string;
        isActive: boolean;
        sku: string;
        descriptionAr: string | null;
        descriptionFr: string | null;
        categoryId: string;
        brandId: string;
        basePrice: number;
        currentStock: number;
        isFeatured: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    createCategory(input: CreateCategoryInput): Promise<{
        parent: {
            id: string;
            nameAr: string;
            nameFr: string;
            imageUrl: string;
            parentId: string | null;
            sortOrder: number;
            isActive: boolean;
        };
        children: {
            id: string;
            nameAr: string;
            nameFr: string;
            imageUrl: string;
            parentId: string | null;
            sortOrder: number;
            isActive: boolean;
        }[];
    } & {
        id: string;
        nameAr: string;
        nameFr: string;
        imageUrl: string;
        parentId: string | null;
        sortOrder: number;
        isActive: boolean;
    }>;
    getCategories(): Promise<({
        parent: {
            id: string;
            nameAr: string;
            nameFr: string;
            imageUrl: string;
            parentId: string | null;
            sortOrder: number;
            isActive: boolean;
        };
        children: {
            id: string;
            nameAr: string;
            nameFr: string;
            imageUrl: string;
            parentId: string | null;
            sortOrder: number;
            isActive: boolean;
        }[];
        _count: {
            products: number;
        };
    } & {
        id: string;
        nameAr: string;
        nameFr: string;
        imageUrl: string;
        parentId: string | null;
        sortOrder: number;
        isActive: boolean;
    })[]>;
    getCategory(id: string): Promise<{
        parent: {
            id: string;
            nameAr: string;
            nameFr: string;
            imageUrl: string;
            parentId: string | null;
            sortOrder: number;
            isActive: boolean;
        };
        children: {
            id: string;
            nameAr: string;
            nameFr: string;
            imageUrl: string;
            parentId: string | null;
            sortOrder: number;
            isActive: boolean;
        }[];
        products: ({
            brand: {
                id: string;
                isActive: boolean;
                name: string;
                logoUrl: string;
            };
            images: {
                id: string;
                imageUrl: string;
                sortOrder: number;
                productId: string;
                isPrimary: boolean;
            }[];
        } & {
            id: string;
            nameAr: string;
            nameFr: string;
            isActive: boolean;
            sku: string;
            descriptionAr: string | null;
            descriptionFr: string | null;
            categoryId: string;
            brandId: string;
            basePrice: number;
            currentStock: number;
            isFeatured: boolean;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } & {
        id: string;
        nameAr: string;
        nameFr: string;
        imageUrl: string;
        parentId: string | null;
        sortOrder: number;
        isActive: boolean;
    }>;
    createBrand(input: CreateBrandInput): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        logoUrl: string;
    }>;
    getBrands(): Promise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        isActive: boolean;
        name: string;
        logoUrl: string;
    })[]>;
    getBrand(id: string): Promise<{
        products: ({
            category: {
                id: string;
                nameAr: string;
                nameFr: string;
                imageUrl: string;
                parentId: string | null;
                sortOrder: number;
                isActive: boolean;
            };
            images: {
                id: string;
                imageUrl: string;
                sortOrder: number;
                productId: string;
                isPrimary: boolean;
            }[];
        } & {
            id: string;
            nameAr: string;
            nameFr: string;
            isActive: boolean;
            sku: string;
            descriptionAr: string | null;
            descriptionFr: string | null;
            categoryId: string;
            brandId: string;
            basePrice: number;
            currentStock: number;
            isFeatured: boolean;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } & {
        id: string;
        isActive: boolean;
        name: string;
        logoUrl: string;
    }>;
    addProductImage(productId: string, imageUrl: string, isPrimary?: boolean): Promise<{
        id: string;
        imageUrl: string;
        sortOrder: number;
        productId: string;
        isPrimary: boolean;
    }>;
    addPriceTier(productId: string, minQuantity: number, pricePerUnit: number): Promise<{
        id: string;
        productId: string;
        minQuantity: number;
        pricePerUnit: number;
    }>;
    searchProducts(query: string, limit?: number): Promise<({
        category: {
            id: string;
            nameAr: string;
            nameFr: string;
            imageUrl: string;
            parentId: string | null;
            sortOrder: number;
            isActive: boolean;
        };
        brand: {
            id: string;
            isActive: boolean;
            name: string;
            logoUrl: string;
        };
        images: {
            id: string;
            imageUrl: string;
            sortOrder: number;
            productId: string;
            isPrimary: boolean;
        }[];
    } & {
        id: string;
        nameAr: string;
        nameFr: string;
        isActive: boolean;
        sku: string;
        descriptionAr: string | null;
        descriptionFr: string | null;
        categoryId: string;
        brandId: string;
        basePrice: number;
        currentStock: number;
        isFeatured: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    updateStock(productId: string, quantity: number, operation?: 'add' | 'subtract'): Promise<{
        id: string;
        nameAr: string;
        nameFr: string;
        isActive: boolean;
        sku: string;
        descriptionAr: string | null;
        descriptionFr: string | null;
        categoryId: string;
        brandId: string;
        basePrice: number;
        currentStock: number;
        isFeatured: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
