import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { PrismaModule } from 'prisma/prisma.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  providers: [CommentService, CommentResolver],
})
export class CommentModule {}
