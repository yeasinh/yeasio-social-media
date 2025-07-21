import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserService } from './user.service';
import { UpdateProfileInput } from './dto/user.dto';
import { User } from './user.model';
import { Post } from 'src/post/dto/post.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  getMyProfile(@CurrentUser() user: any) {
    return this.userService.getMyProfile(user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Post])
  getMyPosts(@CurrentUser() user: any) {
    return this.userService.getMyPosts(user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  updateMyProfile(
    @Args('input') input: UpdateProfileInput,
    @CurrentUser() user: any,
  ) {
    return this.userService.updateMyProfile(user.userId, input);
  }

  @Query(() => User)
  getUserById(@Args('userId') userId: string) {
    return this.userService.findById(userId);
  }
}
