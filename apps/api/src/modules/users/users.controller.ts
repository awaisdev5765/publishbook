import {
  Controller, Get, Patch, Delete, Param, Body, UseGuards,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { UsersService } from './users.service'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { UpdateRoleDto }    from './dto/update-role.dto'
import { CurrentUser }      from '../../common/decorators/current-user.decorator'
import { Roles }            from '../../common/decorators/roles.decorator'
import { RolesGuard }       from '../../common/guards/roles.guard'

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  // ── Own profile ────────────────────────────────────────────────────────────

  @Get('me')
  getMe(@CurrentUser('id') id: string) {
    return this.users.findOne(id)
  }

  @Patch('me')
  updateMe(@CurrentUser('id') id: string, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(id, dto)
  }

  // ── Admin: manage users ────────────────────────────────────────────────────

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.users.findAll()
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.users.findOne(id)
  }

  @Patch(':id/role')
  @Roles(UserRole.ADMIN)
  updateRole(
    @Param('id') targetId: string,
    @CurrentUser('id') requesterId: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.users.updateRole(targetId, requesterId, dto)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(
    @Param('id') id: string,
    @CurrentUser('id') requesterId: string,
    @CurrentUser('role') requesterRole: UserRole,
  ) {
    return this.users.remove(id, requesterId, requesterRole)
  }
}
