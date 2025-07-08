import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';

@ObjectType()
export class Conversation {
  @Field(() => ID) id: string;
  @Field(() => [String]) participantIds: string[];
  @Field({ nullable: true }) title?: string;
  @Field() createdAt: Date;
}

@ObjectType()
export class Message {
  @Field(() => ID) id: string;
  @Field() conversationId: string;
  @Field() senderId: string;
  @Field() content: string;
  @Field() isRead: boolean;
  @Field() createdAt: Date;
}

@ObjectType()
export class TypingEvent {
  @Field() conversationId: string;
  @Field() senderId: string;
}

@ObjectType()
export class UnreadCount {
  @Field() conversationId: string;
  @Field() unreadCount: number;
}

@InputType()
export class StartConversationInput {
  @Field(() => [String]) participantIds: string[];
  @Field({ nullable: true }) title?: string;
}

@InputType()
export class SendMessageInput {
  @Field() conversationId: string;
  @Field() content: string;
  @Field({ nullable: true }) mediaUrl?: string;
}
