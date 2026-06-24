import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException(
        'A senha e a confirmação de senha não coincidem.',
      );
    }

    const emailExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (emailExists) {
      throw new ConflictException('O e-mail informado já está em uso.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...userData } = dto;

    return this.prisma.user.create({
      data: {
        ...userData,
        birthdate: new Date(dto.birthdate),
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    if (dto.password || dto.confirmPassword) {
      if (dto.password !== dto.confirmPassword) {
        throw new BadRequestException(
          'A senha e a confirmação de senha não coincidem.',
        );
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...updateFields } = dto;

    const data = {
      ...updateFields,
      birthdate: dto.birthdate ? new Date(dto.birthdate) : undefined,
    };

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    const user = await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.prisma.exam.updateMany({
      where: { userId: id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    return user;
  }
}
