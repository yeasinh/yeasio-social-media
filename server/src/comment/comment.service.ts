import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCommentInput } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(input: CreateCommentInput, userId: string) {
    return this.prisma.comment.create({
      data: {
        content: input.content,
        postId: input.postId,
        userId,
      },
      include: {
        user: true,
      },
    });
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
}
