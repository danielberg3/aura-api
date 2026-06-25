import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { ExamsModule } from './exams/exams.module';
import { AuthModule } from './auth/auth.module';
import { MedicinesModule } from './medicines/medicines.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NewsModule,
    UsersModule,
    ExamsModule,
    AuthModule,
    MedicinesModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}