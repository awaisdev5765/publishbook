import { IsString, IsOptional, MinLength, MaxLength, IsUrl } from 'class-validator'

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  declare name?: string

  @IsOptional()
  @IsUrl()
  declare avatarUrl?: string
}
