import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UploadResponse {
  @Field()
  filename: string;

  @Field()
  originalName: string;

  @Field()
  url: string;

  @Field()
  path: string;

  @Field()
  size: number;

  @Field()
  mimetype: string;
}
