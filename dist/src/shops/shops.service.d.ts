import { PrismaService } from '../prisma/prisma.service';
import { UpdateShopInput, UpdateShopPasswordInput, CreateShopInput } from './dto/shop.dto';
import { CreateShopImageInput, UpdateShopImageInput } from './dto/shop-image.dto';
import { ShopFiltersInput } from './dto/shop-filters.dto';
import { ShopStats } from './dto/shop-stats.dto';
import { ImageService } from 'src/images/images.service';
import { FileUpload } from 'graphql-upload-ts';
export declare class ShopsService {
    private prisma;
    private readonly imageService;
    constructor(prisma: PrismaService, imageService: ImageService);
    private readonly baseUrl;
    findById(id: string): Promise<{
        shopImages: {
            id: string;
            imageUrl: string;
            sortOrder: number;
            shopId: string;
        }[];
    } & {
        id: string;
        nameAr: string;
        nameFr: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        passwordHash: string;
        ownerName: string;
        city: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
        profileImage: string | null;
        status: import(".prisma/client").$Enums.ShopStatus;
        createdByUserId: string | null;
        approvedByUserId: string | null;
    }>;
    findByPhone(phone: string): Promise<{
        id: string;
        nameAr: string;
        nameFr: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        passwordHash: string;
        ownerName: string;
        city: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
        profileImage: string | null;
        status: import(".prisma/client").$Enums.ShopStatus;
        createdByUserId: string | null;
        approvedByUserId: string | null;
    }>;
    findAll(filters?: ShopFiltersInput): Promise<({
        shopImages: {
            id: string;
            imageUrl: string;
            sortOrder: number;
            shopId: string;
        }[];
    } & {
        id: string;
        nameAr: string;
        nameFr: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        passwordHash: string;
        ownerName: string;
        city: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
        profileImage: string | null;
        status: import(".prisma/client").$Enums.ShopStatus;
        createdByUserId: string | null;
        approvedByUserId: string | null;
    })[]>;
    findPendingShops(): Promise<({
        shopImages: {
            id: string;
            imageUrl: string;
            sortOrder: number;
            shopId: string;
        }[];
    } & {
        id: string;
        nameAr: string;
        nameFr: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        passwordHash: string;
        ownerName: string;
        city: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
        profileImage: string | null;
        status: import(".prisma/client").$Enums.ShopStatus;
        createdByUserId: string | null;
        approvedByUserId: string | null;
    })[]>;
    getShopStats(): Promise<ShopStats>;
    updatePassword(id: string, input: UpdateShopPasswordInput): Promise<{
        id: string;
        nameAr: string;
        nameFr: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        passwordHash: string;
        ownerName: string;
        city: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
        profileImage: string | null;
        status: import(".prisma/client").$Enums.ShopStatus;
        createdByUserId: string | null;
        approvedByUserId: string | null;
    }>;
    updateStatus(id: string, status: 'PENDING' | 'APPROVED' | 'BLOCKED', approvedByUserId?: string): Promise<{
        id: string;
        nameAr: string;
        nameFr: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        passwordHash: string;
        ownerName: string;
        city: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
        profileImage: string | null;
        status: import(".prisma/client").$Enums.ShopStatus;
        createdByUserId: string | null;
        approvedByUserId: string | null;
    }>;
    delete(id: string): Promise<boolean>;
    findShopImages(shopId: string): Promise<{
        id: string;
        imageUrl: string;
        sortOrder: number;
        shopId: string;
    }[]>;
    addShopImage(input: CreateShopImageInput): Promise<{
        id: string;
        imageUrl: string;
        sortOrder: number;
        shopId: string;
    }>;
    updateShopImage(id: string, input: UpdateShopImageInput): Promise<{
        id: string;
        imageUrl: string;
        sortOrder: number;
        shopId: string;
    }>;
    deleteShopImage(id: string): Promise<boolean>;
    createShop(input: CreateShopInput, createdByUserId?: string): Promise<{
        shopImages: {
            id: string;
            imageUrl: string;
            sortOrder: number;
            shopId: string;
        }[];
    } & {
        id: string;
        nameAr: string;
        nameFr: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        passwordHash: string;
        ownerName: string;
        city: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
        profileImage: string | null;
        status: import(".prisma/client").$Enums.ShopStatus;
        createdByUserId: string | null;
        approvedByUserId: string | null;
    }>;
    update(id: string, input: UpdateShopInput, image?: Promise<FileUpload[]>): Promise<{
        id: string;
        nameAr: string;
        nameFr: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        passwordHash: string;
        ownerName: string;
        city: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
        profileImage: string | null;
        status: import(".prisma/client").$Enums.ShopStatus;
        createdByUserId: string | null;
        approvedByUserId: string | null;
    }>;
}
