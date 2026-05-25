import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common'
import { UserRole, OrderStatus } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import type { CreateOrderDto } from './dto/create-order.dto'

const ORDER_SELECT = {
  id: true, serviceType: true, amount: true, status: true,
  stripeSessionId: true, notes: true, createdAt: true, updatedAt: true,
  user: { select: { id: true, name: true, email: true } },
  book: { select: { id: true, title: true } },
} as const

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.order.findMany({
      select:  ORDER_SELECT,
      orderBy: { createdAt: 'desc' },
    })
  }

  async findMine(userId: string) {
    return this.prisma.order.findMany({
      where:   { userId },
      select:  ORDER_SELECT,
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(id: string, requesterId: string, requesterRole: UserRole) {
    const order = await this.prisma.order.findUnique({ where: { id }, select: ORDER_SELECT })
    if (!order) throw new NotFoundException('Order not found')
    if ((order.user as { id: string }).id !== requesterId && requesterRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Forbidden')
    }
    return order
  }

  async create(userId: string, dto: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        serviceType: dto.serviceType,
        amount:      dto.amount,
        notes:       dto.notes,
        userId,
        ...(dto.bookId && { bookId: dto.bookId }),
        // stripeSessionId populated later by webhook (Phase 7)
      },
      select: ORDER_SELECT,
    })
  }

  async cancel(id: string, requesterId: string, requesterRole: UserRole) {
    const order = await this.findOne(id, requesterId, requesterRole)
    if (order.status === OrderStatus.PAID) {
      throw new BadRequestException('Cannot cancel a paid order')
    }
    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order is already cancelled')
    }
    return this.prisma.order.update({
      where:  { id },
      data:   { status: OrderStatus.CANCELLED },
      select: ORDER_SELECT,
    })
  }
}
