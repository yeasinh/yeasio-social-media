import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreatePostInput,
  SharePostInput,
  UpdatePostInput,
} from './dto/post.dto';

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

  async updatePost(input: UpdatePostInput, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: input.postId },
    });
    if (!post || post.authorId !== userId) throw new Error('Forbidden');

    return this.prisma.post.update({
      where: { id: input.postId },
      data: {
        title: input.title,
        content: input.content,
      },
    });
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.authorId !== userId) throw new Error('Forbidden');

    await this.prisma.post.delete({ where: { id: postId } });
    return true;
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
