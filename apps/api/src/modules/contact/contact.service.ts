import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import type { CreateContactDto } from './dto/create-contact.dto'

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async submit(dto: CreateContactDto) {
    const entry = await this.prisma.contact.create({ data: dto })
    // Email notification via Resend wired up in Phase 7
    return { message: "Your message has been received. We'll be in touch soon.", id: entry.id }
  }

  async findAll() {
    return this.prisma.contact.findMany({ orderBy: { createdAt: 'desc' } })
  }

  async findUnread() {
    return this.prisma.contact.findMany({
      where:   { isRead: false },
      orderBy: { createdAt: 'desc' },
    })
  }

  async markRead(id: string) {
    const contact = await this.prisma.contact.findUnique({ where: { id } })
    if (!contact) throw new NotFoundException('Contact submission not found')
    return this.prisma.contact.update({ where: { id }, data: { isRead: true } })
  }
}
