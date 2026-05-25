import {
  IsString, IsOptional, MinLength, MaxLength, IsUrl, IsArray, IsBoolean,
} from 'class-validator'

export class CreatePostDto {
  @IsString()
  @MinLength(4)
  @MaxLength(200)
  declare title: string

  @IsString()
  @MinLength(10)
  declare content: string

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

  @IsOptional()
  @IsBoolean()
  declare isPublished?: boolean
}
