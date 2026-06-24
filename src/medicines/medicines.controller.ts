import { Controller, Get, Post, Body, Param, Delete, Req } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';

@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @Post()
  create(@Body() createMedicineDto: CreateMedicineDto, @Req() req: any) {
    // Nota: Em um cenário real com Guard, o usuário já estaria em req.user
    const userId = req.user?.id || req.user?.sub; 
    return this.medicinesService.create(userId, createMedicineDto);
  }

  @Get()
  findAll(@Req() req: any) {
    const userId = req.user?.id || req.user?.sub;
    return this.medicinesService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id || req.user?.sub;
    return this.medicinesService.findOne(id, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id || req.user?.sub;
    return this.medicinesService.remove(id, userId);
  }
}