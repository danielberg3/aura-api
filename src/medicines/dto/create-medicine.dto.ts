import { IsString, IsInt, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateMedicineDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  dose!: string;

  @IsInt()
  @IsNotEmpty()
  intervalHours!: number;

  @IsDateString()
  @IsNotEmpty()
  startTime!: string;
}