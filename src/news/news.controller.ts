import {
  Controller,
  Get,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';

@ApiTags('Notícias Médicas')
@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Cadastrar notícia médica',
    description:
      'Cria uma nova notícia relacionada à saúde, medicina, pesquisas clínicas ou prevenção de doenças.',
  })
  @ApiBody({ type: CreateNewsDto })
  @ApiResponse({
    status: 201,
    description: 'Notícia criada com sucesso',
  })
  create(
    @Body() createNewsDto: CreateNewsDto,
  ) {
    return this.newsService.create(createNewsDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar notícias médicas',
    description:
      'Retorna uma lista paginada de notícias sobre saúde e medicina.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Número da página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Quantidade de registros por página',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de notícias retornada com sucesso',
  })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.newsService.findAll(
      Number(page) || 1,
      Number(limit) || 10,
    );
  }
}