import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Public } from '../../common/decorators/public.decorator'
import { Roles } from '../../common/decorators/roles.decorator'
import { RolesGuard } from '../../common/guards/roles.guard'
import { AboutService } from './about.service'
import { UpdateAboutDto } from './dto/update-about.dto'

@Controller('about')
@UseGuards(RolesGuard)
export class AboutController {
  constructor(private readonly about: AboutService) {}

  @Get()
  @Public()
  getAbout() {
    return this.about.getAbout()
  }

  @Put()
  @Roles(UserRole.ADMIN)
  updateAbout(@Body() dto: UpdateAboutDto) {
    return this.about.updateAbout(dto)
  }
}
