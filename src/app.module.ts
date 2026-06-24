import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { ExamsModule } from './exams/exams.module';

@Module({
  imports: [NewsModule, UsersModule, ExamsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
