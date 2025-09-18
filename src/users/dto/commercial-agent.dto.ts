import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class CommercialAgent {
  @Field(() => ID)
  id: string;

  @Field()
  territory: string;

  @Field()
  commissionRate: number;

  @Field()
  userId: string;
}
