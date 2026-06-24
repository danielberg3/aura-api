import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';

@Injectable()
export class MedicinesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createMedicineDto: CreateMedicineDto) {
    return this.prisma.medicineRoutine.create({
      data: {
        userId,
        name: createMedicineDto.name,
        dose: createMedicineDto.dose,
        intervalHours: createMedicineDto.intervalHours,
        startTime: new Date(createMedicineDto.startTime),
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.medicineRoutine.findMany({
      where: {
        userId,
      },
    });
  }
}