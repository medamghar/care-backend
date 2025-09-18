import {
  ObjectType,
  Field,
  ID,
  InputType,
  registerEnumType,
  Scalar,
} from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ShopStatus } from '@prisma/client';
import { ShopImage } from './shop-image.dto';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
// Correct Upload scalar implementation
// Register the Prisma enum with GraphQL
registerEnumType(ShopStatus, {
  name: 'ShopStatus',
  description: 'Shop status enum',
});

@ObjectType()
export class Shop {
  @Field(() => ID)
  id: string;

  @Field()
  nameAr: string;

  @Field({ nullable: true })
  nameFr?: string;

  @Field()
  ownerName: string;

  @Field()
  phone: string;

  @Field()
  city: string;

  @Field()
  address: string;

  @Field({ nullable: true })
  latitude?: number;

  @Field({ nullable: true })
  longitude?: number;

  @Field(() => String)
  status: ShopStatus;

  @Field({ nullable: true })
  profileImage?: string;

  @Field(() => [ShopImage], { nullable: true })
  shopImages?: ShopImage[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class UpdateShopInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'اسم المتجر لا يمكن أن يكون فارغاً' })
  nameAr?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nameFr?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'اسم المالك لا يمكن أن يكون فارغاً' })
  ownerName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'المدينة لا يمكن أن تكون فارغة' })
  city?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'العنوان لا يمكن أن يكون فارغاً' })
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'خط العرض يجب أن يكون رقماً صحيحاً' })
  latitude?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'خط الطول يجب أن يكون رقماً صحيحاً' })
  longitude?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  profileImage?: string;



}



@InputType()
export class UpdateShopPasswordInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

@InputType()
export class CreateShopInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'اسم المتجر لا يمكن أن يكون فارغاً' })
  nameAr: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nameFr?: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'اسم المالك لا يمكن أن يكون فارغاً' })
  ownerName: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'رقم الهاتف مطلوب' })
  phone: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'المدينة لا يمكن أن تكون فارغة' })
  city: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'العنوان لا يمكن أن يكون فارغاً' })
  address: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'خط العرض يجب أن يكون رقماً صحيحاً' })
  latitude?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'خط الطول يجب أن يكون رقماً صحيحاً' })
  longitude?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  profileImage?: string;
}
