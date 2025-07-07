import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationType } from 'src/notification/dto/notification.dto';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async startConversation(
    creatorId: string,
    participantIds: string[],
    title?: string,
  ) {
    if (!participantIds.includes(creatorId)) {
      participantIds.push(creatorId);
    }

    const conversation = await this.prisma.conversation.create({
      data: {
        title: title ?? null,
        participants: {
          connect: participantIds.map((id) => ({ id })),
        },
      },
      include: { participants: true },
    });

    return conversation;
  }

  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        participants: {
          some: { id: userId },
        },
      },
      orderBy: { createdAt: 'desc' },
      include: { participants: true },
    });
  }

  async getMessages(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    mediaUrl?: string,
  ) {
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
        mediaUrl,
      },
    });

    // Notify all participants except sender
    const convo = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true },
    });

    for (const user of convo.participants) {
      if (user.id !== senderId) {
        await this.notificationService.createNotification(
          user.id,
          senderId,
          NotificationType.MESSAGE,
          'You have a new message',
          conversationId,
        );
      }
    }

    return message;
  }

  async markMessagesAsRead(conversationId: string, userId: string) {
    return this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  async getUnreadCount(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        participants: {
          some: { id: userId },
        },
      },
      include: {
        messages: {
          where: {
            isRead: false,
            senderId: { not: userId },
          },
          select: { id: true },
        },
      },
    });

    return conversations.map((c) => ({
      conversationId: c.id,
      unreadCount: c.messages.length,
    }));
  }

  async searchMessages(
    conversationId: string,
    userId: string,
    keyword: string,
  ) {
    // Confirm user is a participant
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: { id: userId },
        },
      },
    });

    if (!conversation) throw new Error('Access denied');

    return this.prisma.message.findMany({
      where: {
        conversationId,
        content: {
          contains: keyword,
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
