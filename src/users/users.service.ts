import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

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

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltOrRounds);

    const { confirmPassword, password, ...userData } = dto;

    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        birthdate: new Date(dto.birthdate),
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);

    const updateData: any = { ...dto };

    if (dto.password || dto.confirmPassword) {
      if (dto.password !== dto.confirmPassword) {
        throw new BadRequestException(
          'A senha e a confirmação de senha não coincidem.',
        );
      }
      delete updateData.confirmPassword;
    }

    if (dto.birthdate) {
      updateData.birthdate = new Date(dto.birthdate);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }
}
