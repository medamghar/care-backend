import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
import { CommercialAgent } from '../../users/dto/commercial-agent.dto';

@InputType()
export class LoginInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}

@InputType()
export class RegisterShopInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  shopName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  ownerName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  city: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  address: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}

@ObjectType()
export class Role {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => GraphQLJSON)
  permissions: any;
}

@ObjectType()
export class AuthUser {
  @Field()
  id: string;

  @Field()
  phone: string;

  @Field()
  type: string;

  @Field(() => Role)
  role: Role;

  @Field(() => CommercialAgent, { nullable: true })
  commercialAgent?: CommercialAgent;
}

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => AuthUser)
  user: AuthUser;
}

@InputType()
export class UpdatePasswordInput {
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
export class UpdateProfileInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;
}
