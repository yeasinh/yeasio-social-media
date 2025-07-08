import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import {
  CreateCommentInput,
  Comment,
  UpdateCommentInput,
} from './dto/comment.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment)
  createComment(
    @Args('input') input: CreateCommentInput,
    @CurrentUser() user: any,
  ) {
    return this.commentService.create(input, user.userId);
  }

  @Query(() => [Comment])
  getCommentsByPost(@Args('postId') postId: string) {
    return this.commentService.findByPost(postId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment)
  updateComment(
    @Args('input') input: UpdateCommentInput,
    @CurrentUser() user: any,
  ) {
    return this.commentService.updateComment(input, user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  deleteComment(
    @Args('commentId') commentId: string,
    @CurrentUser() user: any,
  ) {
    return this.commentService.deleteComment(commentId, user.userId);
  }
}
