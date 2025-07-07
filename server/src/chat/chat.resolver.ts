import { Resolver, Mutation, Query, Args, Subscription } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import {
  Conversation,
  Message,
  StartConversationInput,
  SendMessageInput,
  TypingEvent,
  UnreadCount,
} from './dto/chat.dto';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

@Resolver()
export class ChatResolver {
  constructor(private chatService: ChatService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Conversation)
  startConversation(
    @Args('input') input: StartConversationInput,
    @CurrentUser() user: any,
  ) {
    return this.chatService.startConversation(
      user.userId,
      input.participantIds,
      input.title,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Conversation])
  getConversations(@CurrentUser() user: any) {
    return this.chatService.getConversations(user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Message])
  getMessages(@Args('conversationId') conversationId: string) {
    return this.chatService.getMessages(conversationId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Message)
  async sendMessage(
    @Args('input') input: SendMessageInput,
    @CurrentUser() user: any,
  ) {
    const message = await this.chatService.sendMessage(
      input.conversationId,
      user.userId,
      input.content,
    );

    pubsub.publish(`newMessage_${input.conversationId}`, {
      messageSent: message,
    });

    return message;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async markMessagesAsRead(
    @Args('conversationId') conversationId: string,
    @CurrentUser() user: any,
  ) {
    await this.chatService.markMessagesAsRead(conversationId, user.userId);
    return true;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [UnreadCount])
  getUnreadCount(@CurrentUser() user: any) {
    return this.chatService.getUnreadCount(user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  emitTyping(
    @Args('conversationId') conversationId: string,
    @CurrentUser() user: any,
  ) {
    pubsub.publish(`typing_${conversationId}`, {
      typingEvent: {
        conversationId,
        senderId: user.userId,
      },
    });
    return true;
  }

  @Subscription(() => Message, {
    filter: (payload, variables) =>
      payload.messageSent.conversationId === variables.conversationId,
  })
  messageSent(@Args('conversationId') conversationId: string) {
    return pubsub.asyncIterator(`newMessage_${conversationId}`);
  }

  @Subscription(() => TypingEvent, {
    filter: (payload, variables) =>
      payload.typingEvent.conversationId === variables.conversationId,
  })
  typingEvent(@Args('conversationId') conversationId: string) {
    return pubsub.asyncIterator(`typing_${conversationId}`);
  }
}
