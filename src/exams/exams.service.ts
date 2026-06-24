import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { StorageService, R2File } from './storage.service';

@Injectable()
export class ExamsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async create(dto: CreateExamDto, file?: R2File) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    let imageUrl = dto.examImage;

    if (file) {
      imageUrl = await this.storageService.uploadFile(file);
    }

    if (!imageUrl) {
      throw new BadRequestException('A imagem do exame é obrigatória.');
    }

    return this.prisma.exam.create({
      data: {
        ...dto,
        examImage: imageUrl,
        examDate: new Date(dto.examDate),
      },
    });
  }

  async findAllByUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return this.prisma.exam.findMany({
      where: { userId },
      orderBy: { examDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
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
}
