import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  Promotion,
  CreatePromotionInput,
  UpdatePromotionInput,
  Slider,
  CreateSliderInput,
  UpdateSliderInput,
} from './dto/promotion.dto';

@Resolver(() => Promotion)
export class PromotionsResolver {
  constructor(private promotionsService: PromotionsService) {}

  @Query(() => [Promotion])
  async promotions(): Promise<Promotion[]> {
    return this.promotionsService.findAll();
  }

  @Query(() => [Promotion])
  async activePromotions(): Promise<Promotion[]> {
    return this.promotionsService.getActivePromotions();
  }

  @Query(() => [Slider])
  async sliders(): Promise<Slider[]> {
    return this.promotionsService.getSliders();
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Promotion)
  async createPromotion(
    @Args('input', { type: () => CreatePromotionInput })
    input: CreatePromotionInput,
  ): Promise<Promotion> {
    const promotionData = {
      ...input,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
    };
    return this.promotionsService.create(promotionData);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Promotion)
  async updatePromotion(
    @Args('id', { type: () => ID }) id: string,
    @Args('input', { type: () => UpdatePromotionInput })
    input: UpdatePromotionInput,
  ): Promise<Promotion> {
    const updateData = {
      ...input,
      ...(input.startDate && { startDate: new Date(input.startDate) }),
      ...(input.endDate && { endDate: new Date(input.endDate) }),
    };
    return this.promotionsService.update(id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deletePromotion(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.promotionsService.remove(id);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Slider)
  async createSlider(
    @Args('input', { type: () => CreateSliderInput }) input: CreateSliderInput,
  ): Promise<Slider> {
    return this.promotionsService.createSlider(input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Slider)
  async updateSlider(
    @Args('id', { type: () => ID }) id: string,
    @Args('input', { type: () => UpdateSliderInput }) input: UpdateSliderInput,
  ): Promise<Slider> {
    return this.promotionsService.updateSlider(id, input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteSlider(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.promotionsService.removeSlider(id);
    return true;
  }
}
