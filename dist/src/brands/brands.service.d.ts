import { PrismaService } from '../prisma/prisma.service';
export declare class BrandsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        isActive: boolean;
        name: string;
        logoUrl: string;
    })[]>;
    findOne(id: string): Promise<{
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
    create(data: {
        name: string;
        logoUrl: string;
    }): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        logoUrl: string;
    }>;
    update(id: string, data: {
        name?: string;
        logoUrl?: string;
        isActive?: boolean;
    }): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        logoUrl: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        logoUrl: string;
    }>;
}
