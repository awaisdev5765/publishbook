import { IsEnum, IsOptional, IsString, IsInt, Min } from 'class-validator'
import { ServiceType } from '@prisma/client'

export class CreateOrderDto {
  @IsEnum(ServiceType)
  declare serviceType: ServiceType

  @IsInt()
  @Min(1)
  declare amount: number // cents

  @IsOptional()
  @IsString()
  declare bookId?: string

  @IsOptional()
  @IsString()
  declare notes?: string
}
