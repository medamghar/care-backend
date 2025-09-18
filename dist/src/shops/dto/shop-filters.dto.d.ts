import { ShopStatus } from '@prisma/client';
export declare class ShopFiltersInput {
    search?: string;
    city?: string;
    status?: ShopStatus;
    ownerName?: string;
}
