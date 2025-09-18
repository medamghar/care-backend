export declare class ShopImage {
    id: string;
    shopId: string;
    imageUrl: string;
    sortOrder: number;
}
export declare class CreateShopImageInput {
    shopId: string;
    imageUrl: string;
    sortOrder?: number;
}
export declare class UpdateShopImageInput {
    imageUrl?: string;
    sortOrder?: number;
}
