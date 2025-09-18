import { BrandsService } from './brands.service';
import { Brand, CreateBrandInput, UpdateBrandInput } from './dto/brand.dto';
export declare class BrandsResolver {
    private brandsService;
    constructor(brandsService: BrandsService);
    brands(): Promise<Brand[]>;
    brand(id: string): Promise<Brand>;
    createBrand(input: CreateBrandInput): Promise<Brand>;
    updateBrand(id: string, input: UpdateBrandInput): Promise<Brand>;
    deleteBrand(id: string): Promise<boolean>;
}
