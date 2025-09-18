export declare class Category {
    id: string;
    nameAr: string;
    nameFr: string;
    imageUrl: string;
    parentId?: string;
    sortOrder: number;
    isActive: boolean;
    children?: Category[];
    parent?: Category;
}
export declare class CreateCategoryInput {
    nameAr: string;
    nameFr: string;
    imageUrl: string;
    parentId?: string;
    sortOrder?: number;
    isActive?: boolean;
}
export declare class UpdateCategoryInput {
    nameAr?: string;
    nameFr?: string;
    imageUrl?: string;
    parentId?: string;
    sortOrder?: number;
    isActive?: boolean;
}
