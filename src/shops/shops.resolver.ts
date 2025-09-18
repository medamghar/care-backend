import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateShopInput, UpdateShopPasswordInput, Shop, CreateShopInput } from './dto/shop.dto';
import { ShopStatus } from '@prisma/client';
import { ShopImage, CreateShopImageInput, UpdateShopImageInput } from './dto/shop-image.dto';
import { ShopFiltersInput } from './dto/shop-filters.dto';
import { ShopStats } from './dto/shop-stats.dto';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@Resolver(() => Shop)
@UseGuards(JwtAuthGuard)
export class ShopsResolver {
  constructor(private shopsService: ShopsService) { }

  @Query(() => [Shop])
  async shops(@Args('filters', { nullable: true }) filters?: ShopFiltersInput): Promise<Shop[]> {
    return this.shopsService.findAll(filters);
  }

  @Query(() => [Shop])
  async pendingShops(): Promise<Shop[]> {
    return this.shopsService.findPendingShops();
  }

  @Query(() => ShopStats)
  async shopStats(): Promise<ShopStats> {
    return this.shopsService.getShopStats();
  }

  @Query(() => Shop)
  async shop(@Args('id', { type: () => ID }) id: string): Promise<Shop> {
    return this.shopsService.findById(id);
  }

  @Query(() => [ShopImage])
  async shopImages(@Args('shopId', { type: () => ID }) shopId: string): Promise<ShopImage[]> {
    return this.shopsService.findShopImages(shopId);
  }

  @Mutation(() => Shop)
  async updateShop(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateShopInput,
    @Args('images', { type: () => [GraphQLUpload] , nullable: true}) images: Promise<FileUpload[]>,

  ): Promise<Shop> {
    // Optional: Add authorization check to ensure user can only update their own shop
    // const currentUser = context.req.user;
    // if (currentUser.shopId !== id && currentUser.role.name !== 'ADMIN') {
    //   throw new UnauthorizedException('You can only update your own shop');
    // }
    console.log('Received images for updateShop:', images);
    return await this.shopsService.update(id, input, images);
  }

  @Mutation(() => Shop)
  async updateShopPassword(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateShopPasswordInput,
  ): Promise<Shop> {
    // Optional: Add authorization check to ensure user can only update their own shop password
    // const currentUser = context.req.user;
    // if (currentUser.shopId !== id && currentUser.role.name !== 'ADMIN') {
    //   throw new UnauthorizedException('You can only update your own shop password');
    // }

    return this.shopsService.updatePassword(id, input);
  }

  @Mutation(() => Boolean)
  async deleteShop(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.shopsService.delete(id);
  }

  @Mutation(() => ShopImage)
  async addShopImage(
    @Args('input') input: CreateShopImageInput,
  ): Promise<ShopImage> {
    return this.shopsService.addShopImage(input);
  }

  @Mutation(() => ShopImage)
  async updateShopImage(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateShopImageInput,
  ): Promise<ShopImage> {
    return this.shopsService.updateShopImage(id, input);
  }

  @Mutation(() => Boolean)
  async deleteShopImage(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.shopsService.deleteShopImage(id);
  }

  @Mutation(() => Shop)
  async approveShop(
    @Args('shopId', { type: () => ID }) shopId: string,
    @Context() context: any,
  ): Promise<Shop> {
    const currentUserId = context.req.user?.id;
    return this.shopsService.updateStatus(shopId, 'APPROVED', currentUserId);
  }

  @Mutation(() => Shop)
  async blockShop(
    @Args('shopId', { type: () => ID }) shopId: string,
    @Context() context: any,
  ): Promise<Shop> {
    const currentUserId = context.req.user?.id;
    return this.shopsService.updateStatus(shopId, 'BLOCKED', currentUserId);
  }

  @Mutation(() => Shop)
  async createShop(
    @Args('input') input: CreateShopInput,
    @Context() context: any,
  ): Promise<Shop> {
    const currentUserId = context.req.user?.id;
    return this.shopsService.createShop(input, currentUserId);
  }

  @Mutation(() => Shop)
  async updateShopStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status', { type: () => String }) status: string,
    @Context() context: any,
  ): Promise<Shop> {
    const currentUserId = context.req.user?.id;
    return this.shopsService.updateStatus(id, status as any, currentUserId);
  }
}
