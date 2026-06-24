import { IsString, IsInt, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicineDto {
  @ApiProperty({
    description: 'Nome do medicamento',
    example: 'Dipirona'
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Dosagem do medicamento',
    example: '500mg'
  })
  @IsString()
  @IsNotEmpty()
  dose!: string;

  @ApiProperty({
    description: 'Intervalo de repetição em horas',
    example: 8
  })
  @IsInt()
  @IsNotEmpty()
  intervalHours!: number;

  @ApiProperty({
    description: 'Horário da primeira ingestão no formato ISO 8601',
    example: '2026-06-25T08:00:00Z'
  })
  @IsDateString()
  @IsNotEmpty()
  startTime!: string;
}