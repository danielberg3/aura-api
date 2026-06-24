import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  BadRequestException,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@ApiTags('Exames')
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @ApiOperation({
    summary: 'Cadastrar um novo exame',
    description:
      'Cria um novo registro de exame laboratorial ou de imagem vinculado ao usuário informado.',
  })
  @ApiBody({ type: CreateExamDto })
  @ApiResponse({
    status: 201,
    description: 'Exame cadastrado com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado.',
  })
  create(@Body() createExamDto: CreateExamDto) {
    return this.examsService.create(createExamDto);
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

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar um exame pelo ID',
    description: 'Atualiza um ou mais campos de um exame ativo específico.',
  })
  @ApiBody({ type: UpdateExamDto })
  @ApiResponse({
    status: 200,
    description: 'Exame atualizado com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Exame não encontrado.',
  })
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examsService.update(id, updateExamDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover (soft-delete) um exame pelo ID',
    description: 'Marca um exame específico como deletado logicamente.',
  })
  @ApiResponse({
    status: 200,
    description: 'Exame removido com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Exame não encontrado.',
  })
  remove(@Param('id') id: string) {
    return this.examsService.remove(id);
  }
}
