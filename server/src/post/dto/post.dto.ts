import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { User } from 'src/user/user.model';

@ObjectType()
export class Post {
  @Field() id: string;
  @Field() title: string;
  @Field() content: string;
  @Field() createdAt: Date;
  @Field(() => User) author: User;
}

@InputType()
export class CreatePostInput {
  @Field() title: string;
  @Field() content: string;
}
