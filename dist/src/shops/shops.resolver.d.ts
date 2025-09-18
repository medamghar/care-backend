import { ShopsService } from './shops.service';
import { UpdateShopInput, UpdateShopPasswordInput, Shop, CreateShopInput } from './dto/shop.dto';
import { ShopImage, CreateShopImageInput, UpdateShopImageInput } from './dto/shop-image.dto';
import { ShopFiltersInput } from './dto/shop-filters.dto';
import { ShopStats } from './dto/shop-stats.dto';
import { FileUpload } from 'graphql-upload-ts';
export declare class ShopsResolver {
    private shopsService;
    constructor(shopsService: ShopsService);
    shops(filters?: ShopFiltersInput): Promise<Shop[]>;
    pendingShops(): Promise<Shop[]>;
    shopStats(): Promise<ShopStats>;
    shop(id: string): Promise<Shop>;
    shopImages(shopId: string): Promise<ShopImage[]>;
    updateShop(id: string, input: UpdateShopInput, images: Promise<FileUpload[]>): Promise<Shop>;
    updateShopPassword(id: string, input: UpdateShopPasswordInput): Promise<Shop>;
    deleteShop(id: string): Promise<boolean>;
    addShopImage(input: CreateShopImageInput): Promise<ShopImage>;
    updateShopImage(id: string, input: UpdateShopImageInput): Promise<ShopImage>;
    deleteShopImage(id: string): Promise<boolean>;
    approveShop(shopId: string, context: any): Promise<Shop>;
    blockShop(shopId: string, context: any): Promise<Shop>;
    createShop(input: CreateShopInput, context: any): Promise<Shop>;
    updateShopStatus(id: string, status: string, context: any): Promise<Shop>;
}
