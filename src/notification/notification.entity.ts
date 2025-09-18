import { Field, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';



@ObjectType()
export class Notification {
  @Field()
  id: string;

  @Field()
  message: string;

  @Field({ nullable: true })
  imageUrl?: string;
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  route?: string;

  @Field(() => GraphQLJSON, { nullable: true }) // Array of strings
  products?:  unknown;
  @Field()
  createdAt: Date;

  @Field()
  isRead: boolean;

  @Field({ nullable: true })
  shopId?: string;  // nullable for global notifications
}
