import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { NotificationType } from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async createNotification(
    userId: string,
    actorId: string,
    type: NotificationType,
    message: string,
    postId?: string,
  ) {
    if (userId === actorId) return null; // don't notify self

    return this.prisma.notification.create({
      data: {
        userId,
        actorId,
        type,
        message,
        postId,
      },
    });
  }

  async getMyNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markNotification(notificationId: string, isRead: boolean) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead },
    });
  }
}
