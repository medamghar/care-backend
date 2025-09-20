import { PrismaService } from '../prisma/prisma.service';
export declare class PromotionsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        promotionCategories: ({
            category: {
                id: string;
                nameAr: string;
                nameFr: string;
            };
        } & {
            categoryId: string;
            promotionId: string;
        })[];
        promotionProducts: ({
            product: {
                id: string;
                nameAr: string;
                nameFr: string;
                sku: string;
            };
        } & {
            promotionId: string;
            productId: string;
        })[];
    } & {
        id: string;
        isActive: boolean;
        name: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.PromotionType;
        value: number;
        startDate: Date;
        endDate: Date;
    })[]>;
    findOne(id: string): Promise<{
        promotionCategories: ({
            category: {
                id: string;
                nameAr: string;
                nameFr: string;
                imageUrl: string;
                parentId: string | null;
                sortOrder: number;
                isActive: boolean;
            };
        } & {
            categoryId: string;
            promotionId: string;
        })[];
        promotionProducts: ({
            product: {
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
                comparePrice: number | null;
                currentStock: number;
                isFeatured: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            promotionId: string;
            productId: string;
        })[];
    } & {
        id: string;
        isActive: boolean;
        name: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.PromotionType;
        value: number;
        startDate: Date;
        endDate: Date;
    }>;
    create(data: {
        name: string;
        type: 'PERCENTAGE' | 'FIXED';
        value: number;
        startDate: Date;
        endDate: Date;
        productIds?: string[];
        categoryIds?: string[];
    }): Promise<{
        promotionCategories: ({
            category: {
                id: string;
                nameAr: string;
                nameFr: string;
                imageUrl: string;
                parentId: string | null;
                sortOrder: number;
                isActive: boolean;
            };
        } & {
            categoryId: string;
            promotionId: string;
        })[];
        promotionProducts: ({
            product: {
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
                comparePrice: number | null;
                currentStock: number;
                isFeatured: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            promotionId: string;
            productId: string;
        })[];
    } & {
        id: string;
        isActive: boolean;
        name: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.PromotionType;
        value: number;
        startDate: Date;
        endDate: Date;
    }>;
    update(id: string, data: {
        name?: string;
        type?: 'PERCENTAGE' | 'FIXED';
        value?: number;
        startDate?: Date;
        endDate?: Date;
        isActive?: boolean;
    }): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.PromotionType;
        value: number;
        startDate: Date;
        endDate: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        isActive: boolean;
        name: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.PromotionType;
        value: number;
        startDate: Date;
        endDate: Date;
    }>;
    getActivePromotions(): Promise<({
        promotionCategories: ({
            category: {
                id: string;
                nameAr: string;
                nameFr: string;
                imageUrl: string;
                parentId: string | null;
                sortOrder: number;
                isActive: boolean;
            };
        } & {
            categoryId: string;
            promotionId: string;
        })[];
        promotionProducts: ({
            product: {
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
                comparePrice: number | null;
                currentStock: number;
                isFeatured: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            promotionId: string;
            productId: string;
        })[];
    } & {
        id: string;
        isActive: boolean;
        name: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.PromotionType;
        value: number;
        startDate: Date;
        endDate: Date;
    })[]>;
    getSliders(): Promise<{
        id: string;
        imageUrl: string;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        linkUrl: string | null;
    }[]>;
    createSlider(data: {
        imageUrl: string;
        linkUrl?: string;
        sortOrder?: number;
    }): Promise<{
        id: string;
        imageUrl: string;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        linkUrl: string | null;
    }>;
    updateSlider(id: string, data: {
        imageUrl?: string;
        linkUrl?: string;
        sortOrder?: number;
        isActive?: boolean;
    }): Promise<{
        id: string;
        imageUrl: string;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        linkUrl: string | null;
    }>;
    removeSlider(id: string): Promise<{
        id: string;
        imageUrl: string;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        linkUrl: string | null;
    }>;
}
