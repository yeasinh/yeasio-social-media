import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification, MarkNotificationInput } from './dto/notification.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private service: NotificationService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Notification])
  getMyNotifications(@CurrentUser() user: any) {
    return this.service.getMyNotifications(user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Notification)
  markNotification(@Args('input') input: MarkNotificationInput) {
    return this.service.markNotification(input.notificationId, input.isRead);
  }
}
