import {
  Controller, Get, Post, Patch, Param, Body, UseGuards,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { OrdersService }   from './orders.service'
import { CreateOrderDto }  from './dto/create-order.dto'
import { CurrentUser }     from '../../common/decorators/current-user.decorator'
import { Roles }           from '../../common/decorators/roles.decorator'
import { RolesGuard }      from '../../common/guards/roles.guard'

@Controller('orders')
@UseGuards(RolesGuard)
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.orders.findAll()
  }

  @Get('mine')
  findMine(@CurrentUser('id') userId: string) {
    return this.orders.findMine(userId)
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser('id') requesterId: string,
    @CurrentUser('role') requesterRole: UserRole,
  ) {
    return this.orders.findOne(id, requesterId, requesterRole)
  }

  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateOrderDto) {
    return this.orders.create(userId, dto)
  }

  @Patch(':id/cancel')
  cancel(
    @Param('id') id: string,
    @CurrentUser('id') requesterId: string,
    @CurrentUser('role') requesterRole: UserRole,
  ) {
    return this.orders.cancel(id, requesterId, requesterRole)
  }
}
