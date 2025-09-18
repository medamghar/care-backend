import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ShopStats {
  @Field(() => Int)
  totalShops: number;

  @Field(() => Int)
  activeShops: number;

  @Field(() => Int)
  pendingApprovals: number;

  @Field(() => Int)
  blockedShops: number;

  @Field(() => Int)
  newShopsThisMonth: number;
}