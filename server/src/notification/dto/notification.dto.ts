import {
  ObjectType,
  Field,
  ID,
  registerEnumType,
  InputType,
} from '@nestjs/graphql';

export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  SHARE = 'SHARE',
  MESSAGE = 'MESSAGE',
}

registerEnumType(NotificationType, {
  name: 'NotificationType',
});

@ObjectType()
export class Notification {
  @Field(() => ID) id: string;
  @Field(() => NotificationType) type: NotificationType;
  @Field() userId: string;
  @Field() actorId: string;
  @Field({ nullable: true }) postId?: string;
  @Field() message: string;
  @Field() isRead: boolean;
  @Field() createdAt: Date;
}

@InputType()
export class MarkNotificationInput {
  @Field() notificationId: string;
  @Field() isRead: boolean;
}
