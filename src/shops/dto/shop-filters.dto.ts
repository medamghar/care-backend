import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ShopStatus } from '@prisma/client';

@InputType()
export class ShopFiltersInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(ShopStatus)
  status?: ShopStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  ownerName?: string;
}