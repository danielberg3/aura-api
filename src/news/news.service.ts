import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async create(createNewsDto: CreateNewsDto) {
    return await this.prisma.news.create({
      data: {
        ...createNewsDto,
        publishedAt: new Date(createNewsDto.publishedAt),
      },
    });
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      this.prisma.news.findMany({
        skip,
        take: limit,
        orderBy: {
          publishedAt: 'desc',
        },
      }),
      this.prisma.news.count(),
    ]);

    return {
      data: news,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
