import { IsEnum } from 'class-validator'
import { BookStatus } from '@prisma/client'

export class UpdateStatusDto {
  @IsEnum(BookStatus)
  declare status: BookStatus
}
