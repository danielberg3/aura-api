import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const { password, ...result } = user;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Visualizar o perfil do usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário logado retornados com sucesso.',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado ou token inválido.',
  })
  async findMe(@Req() req: any) {
    const userId = req.user.sub;
    const user = await this.usersService.findOne(userId);
    const { password, ...result } = user;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um usuário pelo ID' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado ou token inválido.',
  })
  @ApiResponse({
    status: 403,
    description: 'Proibido: você não pode alterar dados de outro usuário.',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    if (req.user.sub !== id) {
      throw new ForbiddenException(
        'Você só tem permissão para atualizar sua própria conta.',
      );
    }

    const user = await this.usersService.update(id, updateUserDto);
    const { password, ...result } = user;
    return result;
  }
}
