import {
  Controller, Get, Post, Patch, Param, Body, UseGuards,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { ContactService }    from './contact.service'
import { CreateContactDto }  from './dto/create-contact.dto'
import { Public }            from '../../common/decorators/public.decorator'
import { Roles }             from '../../common/decorators/roles.decorator'
import { RolesGuard }        from '../../common/guards/roles.guard'

@Controller('contact')
@UseGuards(RolesGuard)
export class ContactController {
  constructor(private readonly contact: ContactService) {}

  @Post()
  @Public()
  submit(@Body() dto: CreateContactDto) {
    return this.contact.submit(dto)
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.contact.findAll()
  }

  @Get('unread')
  @Roles(UserRole.ADMIN)
  findUnread() {
    return this.contact.findUnread()
  }

  @Patch(':id/read')
  @Roles(UserRole.ADMIN)
  markRead(@Param('id') id: string) {
    return this.contact.markRead(id)
  }
}
