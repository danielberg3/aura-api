import {
  IsString,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty({
    example:
      'Novo estudo aponta benefícios da atividade física para a saúde cardiovascular',
    description: 'Título da notícia médica ou de saúde',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example:
      'Pesquisadores divulgaram resultados que demonstram redução significativa do risco de doenças cardiovasculares.',
    description: 'Conteúdo completo da notícia',
  })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({
    example: '2026-06-22T10:00:00Z',
    description: 'Data de publicação da notícia',
  })
  @IsDateString()
  publishedAt!: string;
}