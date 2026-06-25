import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExamDto {
  @ApiProperty({
    example: 'Hemograma Completo',
    description: 'Nome do exame',
  })
  @IsString()
  @IsNotEmpty({ message: 'O nome do exame é obrigatório.' })
  examName!: string;

  @ApiProperty({
    example: '2026-06-24T14:00:00Z',
    description: 'Data de realização do exame',
  })
  @IsDateString({}, { message: 'A data do exame deve ser uma data válida.' })
  @IsNotEmpty({ message: 'A data do exame é obrigatória.' })
  examDate!: string;

  @ApiProperty({
    example: 'Exame de sangue para rotina geral.',
    description: 'Descrição ou observações do exame',
  })
  @IsString()
  @IsNotEmpty({ message: 'A descrição do exame é obrigatória.' })
  examDescription!: string;

  @ApiProperty({
    example: 'https://exemplo.com/imagens/exame123.jpg',
    description:
      'URL ou representação em string da imagem do exame (preenchida automaticamente via upload)',
    required: false,
  })
  @IsString()
  @IsOptional()
  examImage?: string;

  @ApiProperty({
    example: 'user-uuid-1234',
    description: 'Vínculo com o ID do usuário',
  })
  @IsString()
  @IsNotEmpty({ message: 'O ID do usuário é obrigatório.' })
  userId!: string;
}
