import { IsEmail, IsString, IsOptional, MinLength, MaxLength } from 'class-validator'

export class CreateContactDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  declare name: string

  @IsEmail()
  declare email: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  declare subject?: string

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  declare message: string
}
