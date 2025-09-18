import { ObjectType, Field, ID, InputType, Int } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';

@ObjectType()
export class Category {
  @Field(() => ID)
  id: string;

  @Field()
  nameAr: string;

  @Field()
  nameFr: string;

  @Field()
  imageUrl: string;

  @Field(() => ID, { nullable: true })
  parentId?: string;

  @Field(() => Int)
  sortOrder: number;

  @Field()
  isActive: boolean;

  @Field(() => [Category], { nullable: true })
  children?: Category[];

  @Field(() => Category, { nullable: true })
  parent?: Category;
}

@InputType()
export class CreateCategoryInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  nameFr: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  parentId?: string;

  @Field(() => Int, { defaultValue: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @Field({ defaultValue: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@InputType()
export class UpdateCategoryInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nameAr?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nameFr?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  parentId?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
