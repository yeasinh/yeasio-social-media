import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { User } from 'src/user/user.model';

@ObjectType()
export class Post {
  @Field() id: string;
  @Field() title: string;
  @Field() content: string;
  @Field() createdAt: Date;
  @Field(() => User) author: User;
  @Field(() => Post, { nullable: true }) sharedFrom?: Post;
}

@InputType()
export class CreatePostInput {
  @Field() title: string;
  @Field() content: string;
}

@InputType()
export class UpdatePostInput {
  @Field() postId: string;
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) content?: string;
}

@InputType()
export class SharePostInput {
  @Field() postId: string; // original post to share
  @Field({ nullable: true }) title?: string; // optional comment
  @Field({ nullable: true }) content?: string; // optional message
}
