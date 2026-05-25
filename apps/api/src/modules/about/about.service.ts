import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import type { UpdateAboutDto } from './dto/update-about.dto'

const ABOUT_KEY = 'about'

@Injectable()
export class AboutService {
  constructor(private readonly prisma: PrismaService) {}

  async getAbout() {
    const entry = await this.prisma.siteContent.findUnique({
      where: { key: ABOUT_KEY },
    })

    if (!entry) {
      return {
        key: ABOUT_KEY,
        title: 'About Smart Book Publishing',
        content: 'Tell your brand story here. Admin can update this content from the dashboard.',
        updatedAt: null,
      }
    }

    return entry
  }

  async updateAbout(dto: UpdateAboutDto) {
    return this.prisma.siteContent.upsert({
      where: { key: ABOUT_KEY },
      update: {
        title: dto.title ?? null,
        content: dto.content,
      },
      create: {
        key: ABOUT_KEY,
        title: dto.title ?? null,
        content: dto.content,
      },
    })
  }
}
