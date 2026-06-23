import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsDateString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'João da Silva',
    description: 'Nome completo do usuário',
  })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name!: string;

  @ApiProperty({ example: 'joao@email.com', description: 'E-mail do usuário' })
  @IsEmail({}, { message: 'O e-mail deve ser válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email!: string;

  @ApiProperty({
    example: 'SenhaForte123',
    description: 'Senha de acesso (mínimo 6 caracteres)',
  })
  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password!: string;

  @ApiProperty({
    example: 'SenhaForte123',
    description: 'Confirmação da senha',
  })
  @IsString()
  @IsNotEmpty({ message: 'A confirmação de senha é obrigatória.' })
  confirmPassword!: string;

  @ApiProperty({
    example: '1990-05-15',
    description: 'Data de nascimento no formato YYYY-MM-DD',
  })
  @IsDateString(
    {},
    { message: 'A data de nascimento deve estar no formato válido.' },
  )
  @IsNotEmpty({ message: 'A data de nascimento é obrigatória.' })
  birthdate!: string;
}
