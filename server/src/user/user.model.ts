import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field() id: string;
  @Field() email: string;
  @Field() name: string;
  @Field({ nullable: true }) profilePhoto?: string;
  @Field() createdAt: Date;
}
