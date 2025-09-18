import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Brand, CreateBrandInput, UpdateBrandInput } from './dto/brand.dto';

@Resolver(() => Brand)
export class BrandsResolver {
  constructor(private brandsService: BrandsService) {}

  @Query(() => [Brand])
  async brands(): Promise<Brand[]> {
    return this.brandsService.findAll();
  }

  @Query(() => Brand)
  async brand(@Args('id', { type: () => ID }) id: string): Promise<Brand> {
    return this.brandsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Brand)
  async createBrand(
    @Args('input', { type: () => CreateBrandInput }) input: CreateBrandInput,
  ): Promise<Brand> {
    return this.brandsService.create(input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Brand)
  async updateBrand(
    @Args('id', { type: () => ID }) id: string,
    @Args('input', { type: () => UpdateBrandInput }) input: UpdateBrandInput,
  ): Promise<Brand> {
    return this.brandsService.update(id, input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteBrand(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.brandsService.remove(id);
    return true;
  }
}
