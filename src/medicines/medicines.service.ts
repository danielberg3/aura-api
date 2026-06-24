import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';

@Injectable()
export class MedicinesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createMedicineDto: CreateMedicineDto) {
    const startTime = new Date(createMedicineDto.startTime);
    const intervalHours = createMedicineDto.intervalHours;
    
    const schedules: { time: Date }[] = []; 
    const dosesCount = Math.floor((24 / intervalHours) * 30); 
    let currentTime = new Date(startTime);

    for (let i = 0; i < dosesCount; i++) {
      schedules.push({ time: new Date(currentTime) });
      currentTime.setHours(currentTime.getHours() + intervalHours);
    }

    // Criamos no banco, mas NÃO incluímos os 720 schedules no retorno para não pesar a API
    return this.prisma.medicineRoutine.create({
      data: {
        userId,
        name: createMedicineDto.name,
        dose: createMedicineDto.dose,
        intervalHours: intervalHours,
        startTime: startTime,
        schedules: {
          create: schedules,
        },
      }
    });
  }

  async findAll(userId: string) {
    return this.prisma.medicineRoutine.findMany({
      where: { 
        userId, 
        isActive: true 
      },
    });
  }

  async findOne(id: string, userId: string) {
    const medicine = await this.prisma.medicineRoutine.findFirst({
      where: { 
        id, 
        userId, 
        isActive: true 
      },
      include: { 
        schedules: {
          where: {
            time: {
              gte: new Date(), // Retorna apenas as doses de agora em diante (ignora as que já passaram)
            }
          },
          orderBy: {
            time: 'asc'
          },
          take: 10 // Limita para trazer apenas as próximas 10 doses no detalhamento
        } 
      },
    });

    if (!medicine) {
      throw new NotFoundException('Medicamento não encontrado');
    }

    return medicine;
  }

  async remove(id: string, userId: string) {
    const medicine = await this.prisma.medicineRoutine.findFirst({
      where: { id, userId, isActive: true }
    });

    if (!medicine) {
      throw new NotFoundException('Medicamento não encontrado');
    }

    return this.prisma.medicineRoutine.update({
      where: { id },
      data: { isActive: false },
    });
  }
}