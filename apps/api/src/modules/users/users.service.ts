import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import type { UpdateProfileDto } from './dto/update-profile.dto'
import type { UpdateRoleDto } from './dto/update-role.dto'

const SAFE_SELECT = {
  id: true, name: true, email: true, role: true, avatarUrl: true,
  createdAt: true, updatedAt: true,
} as const

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({ select: SAFE_SELECT, orderBy: { createdAt: 'desc' } })
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: SAFE_SELECT })
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    await this.findOne(id)
    return this.prisma.user.update({ where: { id }, data: dto, select: SAFE_SELECT })
  }

  async updateRole(targetId: string, requesterId: string, dto: UpdateRoleDto) {
    if (targetId === requesterId) throw new ForbiddenException('Cannot change your own role')
    await this.findOne(targetId)
    return this.prisma.user.update({
      where:  { id: targetId },
      data:   { role: dto.role },
      select: SAFE_SELECT,
    })
  }

  async remove(id: string, requesterId: string, requesterRole: UserRole) {
    if (id === requesterId) throw new ForbiddenException('Cannot delete your own account')
    if (requesterRole !== UserRole.ADMIN) throw new ForbiddenException('Forbidden')
    await this.findOne(id)
    await this.prisma.user.delete({ where: { id } })
    return { message: 'User deleted' }
  }
}
