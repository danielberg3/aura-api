import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsDateString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name!: string;

  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'A confirmação de senha é obrigatória.' })
  confirmPassword!: string;

  @IsDateString({}, { message: 'A data nascimento deve ser válida.' })
  @IsNotEmpty({ message: 'A data de nascimento é obrigatória.' })
  birthdate!: string;
}
