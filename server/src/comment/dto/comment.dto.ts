import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { User } from 'src/user/user.model';

@ObjectType()
export class Comment {
  @Field() id: string;
  @Field() content: string;
  @Field() createdAt: Date;
  @Field() postId: string;
  @Field() userId: string;
  @Field(() => User) user: User;
}

@InputType()
export class CreateCommentInput {
  @Field() postId: string;
  @Field() content: string;
}

@InputType()
export class UpdateCommentInput {
  @Field() commentId: string;
  @Field() content: string;
}
