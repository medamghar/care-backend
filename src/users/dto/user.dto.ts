import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { Role } from '../../auth/dto/auth.dto';
import { CommercialAgent } from './commercial-agent.dto';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  phone: string;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Role)
  role: Role;

  @Field(() => CommercialAgent, { nullable: true })
  commercialAgent?: CommercialAgent;
}

@InputType()
export class CreateUserInput {
  @Field()
  phone: string;

  @Field()
  password: string;

  @Field()
  roleId: string;

  @Field({ defaultValue: true })
  isActive: boolean;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  roleId?: string;

  @Field({ nullable: true })
  isActive?: boolean;
}
