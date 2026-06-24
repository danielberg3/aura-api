import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@Injectable()
export class ExamsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateExamDto) {
    const user = await this.prisma.user.findFirst({
      where: { id: dto.userId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return this.prisma.exam.create({
      data: {
        ...dto,
        examDate: new Date(dto.examDate),
      },
    });
  }

  async findAllByUser(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return this.prisma.exam.findMany({
      where: { userId, deletedAt: null },
      orderBy: { examDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const exam = await this.prisma.exam.findFirst({
      where: { id, deletedAt: null, user: { deletedAt: null } },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!exam) {
      throw new NotFoundException('Exame não encontrado.');
    }

    return exam;
  }

  async update(id: string, dto: UpdateExamDto) {
    await this.findOne(id);

    const data = {
      ...dto,
      examDate: dto.examDate ? new Date(dto.examDate) : undefined,
    };

    return this.prisma.exam.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.exam.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
