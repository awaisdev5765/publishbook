import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator'

export class UpdateAboutDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  declare title?: string

  @IsString()
  @MinLength(20)
  @MaxLength(20000)
  declare content: string
}
