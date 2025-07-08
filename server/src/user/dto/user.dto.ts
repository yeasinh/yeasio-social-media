import { ObjectType, Field, InputType } from '@nestjs/graphql';

// @ObjectType()
// export class User {
//   @Field() id: string;
//   @Field() email: string;
//   @Field() name: string;
//   @Field({ nullable: true }) profilePhoto?: string;
//   @Field() createdAt: Date;
// }

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true }) name?: string;
  @Field({ nullable: true }) profilePhoto?: string;
}
