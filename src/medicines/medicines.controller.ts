import { Controller, Post, Body, Req } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';

@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @Post()
  create(@Body() createMedicineDto: CreateMedicineDto, @Req() req: any) {
    const userId = req.user?.id || req.user?.sub;
    return this.medicinesService.create(userId, createMedicineDto);
  }
}