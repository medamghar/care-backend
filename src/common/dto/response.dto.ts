import { ObjectType, Field } from '@nestjs/graphql';
import { AuthUser } from '../../auth/dto/auth.dto';

@ObjectType()
export class StandardResponse {
  @Field()
  ok: boolean;

  @Field()
  message: string;

  @Field({ nullable: true })
  code?: string;
}

@ObjectType()
export class AuthResponse extends StandardResponse {
  @Field({ nullable: true })
  accessToken?: string;

  @Field({ nullable: true })
  refreshToken?: string;

  @Field(() => AuthUser, { nullable: true })
  user?: AuthUser;
}

@ObjectType()
export class RegisterResponse extends StandardResponse {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  status?: string;
}
