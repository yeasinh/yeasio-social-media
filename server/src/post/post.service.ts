import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePostInput, SharePostInput } from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(input: CreatePostInput, userId: string) {
    return this.prisma.post.create({
      data: {
        title: input.title,
        content: input.content,
        authorId: userId,
      },
      include: {
        author: true,
      },
    });
  }

  async getAllPosts() {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
      },
    });
  }

  async sharePost(input: SharePostInput, userId: string) {
    const original = await this.prisma.post.findUnique({
      where: { id: input.postId },
    });

    if (!original) throw new Error('Original post not found');

    return this.prisma.post.create({
      data: {
        title: input.title ?? '',
        content: input.content ?? '',
        authorId: userId,
        sharedFromId: input.postId,
      },
      include: {
        author: true,
        sharedFrom: true,
      },
    });
  }
}
