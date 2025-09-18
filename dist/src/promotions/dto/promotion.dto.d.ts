import { PromotionType } from '@prisma/client';
export declare class Promotion {
    id: string;
    name: string;
    type: PromotionType;
    value: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
}
export declare class CreatePromotionInput {
    name: string;
    type: PromotionType;
    value: number;
    startDate: string;
    endDate: string;
    isActive?: boolean;
}
export declare class UpdatePromotionInput {
    name?: string;
    type?: PromotionType;
    value?: number;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
}
export declare class Slider {
    id: string;
    imageUrl: string;
    linkUrl?: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
}
export declare class CreateSliderInput {
    imageUrl: string;
    linkUrl?: string;
    sortOrder?: number;
    isActive?: boolean;
}
export declare class UpdateSliderInput {
    imageUrl?: string;
    linkUrl?: string;
    sortOrder?: number;
    isActive?: boolean;
}
