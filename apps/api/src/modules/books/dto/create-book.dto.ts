import { IsString, IsOptional, MinLength, MaxLength, IsUrl } from 'class-validator'

export class CreateBookDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  declare title: string

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  declare genre: string

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  declare synopsis?: string

  @IsOptional()
  @IsUrl()
  declare coverUrl?: string

  @IsOptional()
  @IsUrl()
  declare manuscriptUrl?: string
}
