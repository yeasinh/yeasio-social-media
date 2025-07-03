import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { LikeService } from './like.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ToggleLikeInput, Like } from './dto/like.dto';

@Resolver(() => Like)
export class LikeResolver {
  constructor(private likeService: LikeService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  toggleLike(@Args('input') input: ToggleLikeInput, @CurrentUser() user: any) {
    return this.likeService
      .toggleLike(input, user.userId)
      .then((r) => r.status);
  }

  @Query(() => [Like])
  getLikesByPost(@Args('postId') postId: string) {
    return this.likeService.getLikesByPost(postId);
  }
}
