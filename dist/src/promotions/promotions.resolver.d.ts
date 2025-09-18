import { PromotionsService } from './promotions.service';
import { Promotion, CreatePromotionInput, UpdatePromotionInput, Slider, CreateSliderInput, UpdateSliderInput } from './dto/promotion.dto';
export declare class PromotionsResolver {
    private promotionsService;
    constructor(promotionsService: PromotionsService);
    promotions(): Promise<Promotion[]>;
    activePromotions(): Promise<Promotion[]>;
    sliders(): Promise<Slider[]>;
    createPromotion(input: CreatePromotionInput): Promise<Promotion>;
    updatePromotion(id: string, input: UpdatePromotionInput): Promise<Promotion>;
    deletePromotion(id: string): Promise<boolean>;
    createSlider(input: CreateSliderInput): Promise<Slider>;
    updateSlider(id: string, input: UpdateSliderInput): Promise<Slider>;
    deleteSlider(id: string): Promise<boolean>;
}
