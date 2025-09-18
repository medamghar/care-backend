import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
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
    findOne(id: string): Promise<{
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
}
