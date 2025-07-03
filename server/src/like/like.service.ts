import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ToggleLikeInput } from './dto/like.dto';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

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

    await this.prisma.like.create({
      data: {
        userId,
        postId: input.postId,
      },
    });

    return { status: 'liked' };
  }

  async getLikesByPost(postId: string) {
    return this.prisma.like.findMany({
      where: { postId },
    });
  }
}
