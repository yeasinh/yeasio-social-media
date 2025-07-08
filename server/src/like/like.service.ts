import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ToggleLikeInput } from './dto/like.dto';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationType } from 'src/notification/dto/notification.dto';

@Injectable()
export class LikeService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async toggleLike(input: ToggleLikeInput, userId: string) {
    const existing = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: input.postId,
        },
      },
    });

    if (existing) {
      await this.prisma.like.delete({
        where: {
          id: existing.id,
        },
      });
      return { status: 'unliked' };
    }

    // User likes the post - create like
    const like = await this.prisma.like.create({
      data: {
        userId,
        postId: input.postId,
      },
    });

    // Fetch the post with author info for notification
    const post = await this.prisma.post.findUnique({
      where: { id: input.postId },
      include: { author: true },
    });

    if (post && post.authorId !== userId) {
      // Create notification for post author
      await this.notificationService.createNotification(
        post.authorId, // user to notify
        userId, // user who liked
        NotificationType.LIKE,
        `Someone liked your post.`,
        post.id,
      );
    }

    return { status: 'liked' };
  }

  async getLikesByPost(postId: string) {
    return this.prisma.like.findMany({
      where: { postId },
    });
  }
}
