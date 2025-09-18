export declare class Brand {
    id: string;
    name: string;
    logoUrl: string;
    isActive: boolean;
}
export declare class CreateBrandInput {
    name: string;
    logoUrl: string;
    isActive?: boolean;
}
export declare class UpdateBrandInput {
    name?: string;
    logoUrl?: string;
    isActive?: boolean;
}
