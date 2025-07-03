import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Post } from 'src/post/dto/post.dto';

@ObjectType()
export class Like {
  @Field() id: string;
  @Field() postId: string;
  @Field() userId: string;
  @Field() createdAt: Date;
}

@InputType()
export class ToggleLikeInput {
  @Field() postId: string;
}
