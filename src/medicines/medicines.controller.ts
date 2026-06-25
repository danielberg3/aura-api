import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MedicinesService } from './medicines.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';

@ApiTags('medicines')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar uma nova rotina medicamentosa' })
  @ApiResponse({
    status: 201,
    description: 'Rotina medicamentosa criada com sucesso.',
    schema: {
      example: {
        id: "fe050f92-3eae-460c-9f06-a54cca8a7f0b",
        userId: "0a7a4310-e6b0-4885-92fa-c4fa8eb80a2e",
        name: "Dipirona",
        dose: "500mg",
        intervalHours: 8,
        startTime: "2026-06-25T08:00:00.000Z",
        isActive: true
      }
    }
  })
  create(@Body() createMedicineDto: CreateMedicineDto, @Req() req: any) {
    const userId = req.user?.id || req.user?.sub;
    return this.medicinesService.create(userId, createMedicineDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os medicamentos do usuário logado' })
  findAll(@Req() req: any) {
    const userId = req.user?.id || req.user?.sub;
    return this.medicinesService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar detalhes e cronograma de um medicamento' })
  findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id || req.user?.sub;
    return this.medicinesService.findOne(id, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um medicamento (Soft Delete)' })
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id || req.user?.sub;
    return this.medicinesService.remove(id, userId);
  }
}