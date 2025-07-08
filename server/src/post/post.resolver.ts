import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { PostService } from './post.service';
import {
  CreatePostInput,
  Post,
  SharePostInput,
  UpdatePostInput,
} from './dto/post.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Post)
export class PostResolver {
  constructor(private postService: PostService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  createPost(@Args('input') input: CreatePostInput, @CurrentUser() user: any) {
    return this.postService.createPost(input, user.userId);
  }

  @Query(() => [Post])
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  updatePost(@Args('input') input: UpdatePostInput, @CurrentUser() user: any) {
    return this.postService.updatePost(input, user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  deletePost(@Args('postId') postId: string, @CurrentUser() user: any) {
    return this.postService.deletePost(postId, user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  sharePost(@Args('input') input: SharePostInput, @CurrentUser() user: any) {
    return this.postService.sharePost(input, user.userId);
  }
}
