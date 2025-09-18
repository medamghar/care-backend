import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

@ObjectType()
export class ShopImage {
  @Field(() => ID)
  id: string;

  @Field()
  shopId: string;

  @Field()
  imageUrl: string;

  @Field()
  sortOrder: number;
}

@InputType()
export class CreateShopImageInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  shopId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

@InputType()
export class UpdateShopImageInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}