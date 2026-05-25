import {
  IsString, IsOptional, MinLength, MaxLength, IsUrl, IsArray,
} from 'class-validator'

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(200)
  declare title?: string

  @IsOptional()
  @IsString()
  @MinLength(10)
  declare content?: string

  @IsOptional()
  @IsString()
  @MaxLength(300)
  declare excerpt?: string

  @IsOptional()
  @IsUrl()
  declare coverImageUrl?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  declare tags?: string[]
}
