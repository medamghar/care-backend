import {
  ObjectType,
  Field,
  ID,
  InputType,
  registerEnumType,
  Float,
} from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { PromotionType } from '@prisma/client';

registerEnumType(PromotionType, {
  name: 'PromotionType',
});

@ObjectType()
export class Promotion {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => PromotionType)
  type: PromotionType;

  @Field(() => Float)
  value: number;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;
}

@InputType()
export class CreatePromotionInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => PromotionType)
  @IsEnum(PromotionType)
  type: PromotionType;

  @Field(() => Float)
  @IsNumber()
  value: number;

  @Field()
  @IsDateString()
  startDate: string;

  @Field()
  @IsDateString()
  endDate: string;

  @Field({ defaultValue: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@InputType()
export class UpdatePromotionInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => PromotionType, { nullable: true })
  @IsOptional()
  @IsEnum(PromotionType)
  type?: PromotionType;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  value?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@ObjectType()
export class Slider {
  @Field(() => ID)
  id: string;

  @Field()
  imageUrl: string;

  @Field({ nullable: true })
  linkUrl?: string;

  @Field()
  sortOrder: number;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;
}

@InputType()
export class CreateSliderInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  linkUrl?: string;

  @Field({ defaultValue: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @Field({ defaultValue: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@InputType()
export class UpdateSliderInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  linkUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
