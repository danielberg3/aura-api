import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'E-mail cadastrado',
  })
  @IsEmail({}, { message: 'E-mail deve ter um formato válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email!: string;

  @ApiProperty({ example: 'SenhaForte123', description: 'Senha do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  password!: string;
}
