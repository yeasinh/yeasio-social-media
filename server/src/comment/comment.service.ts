import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCommentInput, UpdateCommentInput } from './dto/comment.dto';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationType } from 'src/notification/dto/notification.dto';

@Injectable()
export class CommentService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async create(input: CreateCommentInput, userId: string) {
    const comment = await this.prisma.comment.create({
      data: {
        content: input.content,
        postId: input.postId,
        userId,
      },
      include: {
        user: true,
      },
    });

    // Trigger notification to post author
    const post = await this.prisma.post.findUnique({
      where: { id: input.postId },
    });

    if (post && post.authorId !== userId) {
      await this.notificationService.createNotification(
        post.authorId, // notify post owner
        userId, // who commented
        NotificationType.COMMENT,
        `Someone commented on your post.`,
        post.id,
      );
    }

    return comment;
  }

  async findByPost(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: true,
      },
    });
  }

  async updateComment(input: UpdateCommentInput, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: input.commentId },
    });
    if (!comment || comment.userId !== userId) throw new Error('Forbidden');

    return this.prisma.comment.update({
      where: { id: input.commentId },
      data: {
        content: input.content,
      },
    });
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment || comment.userId !== userId) throw new Error('Forbidden');

    await this.prisma.comment.delete({ where: { id: commentId } });
    return true;
  }
}
