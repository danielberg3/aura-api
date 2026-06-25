import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { R2File } from './storage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Exames')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Cadastrar um novo exame',
    description:
      'Cria um novo registro de exame laboratorial ou de imagem vinculado ao usuário informado, fazendo upload da imagem para o Cloudflare R2.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        examName: { type: 'string', description: 'Nome do exame' },
        examDate: {
          type: 'string',
          format: 'date-time',
          description:
            'Data de realização do exame no formato ISO Date (Ex: 2026-06-24T14:00:00Z)',
        },
        examDescription: {
          type: 'string',
          description: 'Descrição ou observações do exame',
        },
        userId: { type: 'string', description: 'ID do usuário proprietário' },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de imagem ou anexo do exame',
        },
      },
      required: ['examName', 'examDate', 'examDescription', 'userId', 'file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Exame cadastrado com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado.',
  })
  create(@UploadedFile() file: R2File, @Body() createExamDto: CreateExamDto) {
    return this.examsService.create(createExamDto, file);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar exames de um usuário',
    description:
      'Retorna todos os exames associados ao usuário especificado por query parameter.',
  })
  @ApiQuery({
    name: 'userId',
    required: true,
    description: 'ID do usuário para o qual deseja listar os exames',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de exames retornada com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'O ID do usuário é obrigatório.',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado.',
  })
  findAll(@Query('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('O ID do usuário (userId) é obrigatório.');
    }
    return this.examsService.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Detalhamento de um exame específico',
    description:
      'Recupera e exibe todos os dados detalhados de um exame específico selecionado pelo ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados detalhados do exame retornados com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Exame não encontrado.',
  })
  findOne(@Param('id') id: string) {
    return this.examsService.findOne(id);
  }
}
