import { ShopStatus } from '@prisma/client';
import { ShopImage } from './shop-image.dto';
export declare class Shop {
    id: string;
    nameAr: string;
    nameFr?: string;
    ownerName: string;
    phone: string;
    city: string;
    address: string;
    latitude?: number;
    longitude?: number;
    status: ShopStatus;
    profileImage?: string;
    shopImages?: ShopImage[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class UpdateShopInput {
    nameAr?: string;
    nameFr?: string;
    ownerName?: string;
    city?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    profileImage?: string;
}
export declare class UpdateShopPasswordInput {
    oldPassword: string;
    newPassword: string;
}
export declare class CreateShopInput {
    nameAr: string;
    nameFr?: string;
    ownerName: string;
    phone: string;
    password: string;
    city: string;
    address: string;
    latitude?: number;
    longitude?: number;
    profileImage?: string;
}
