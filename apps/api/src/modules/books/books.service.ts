import {
  Injectable, NotFoundException, ForbiddenException,
} from '@nestjs/common'
import { UserRole, BookStatus } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import type { CreateBookDto }  from './dto/create-book.dto'
import type { UpdateBookDto }  from './dto/update-book.dto'
import type { UpdateStatusDto } from './dto/update-status.dto'

const BOOK_SELECT = {
  id: true, title: true, genre: true, status: true,
  coverUrl: true, synopsis: true, manuscriptUrl: true,
  createdAt: true, updatedAt: true,
  author: { select: { id: true, name: true, avatarUrl: true } },
} as const

// Status transitions: who can move a book from → to
const ALLOWED_TRANSITIONS: Record<BookStatus, BookStatus[]> = {
  DRAFT:      ['IN_REVIEW'],
  IN_REVIEW:  ['DRAFT', 'PUBLISHED'],
  PUBLISHED:  ['DRAFT'],
}

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(genre?: string, status?: BookStatus) {
    return this.prisma.book.findMany({
      where: {
        ...(genre  && { genre }),
        ...(status && { status }),
      },
      select:  BOOK_SELECT,
      orderBy: { createdAt: 'desc' },
    })
  }

  async findMine(authorId: string) {
    return this.prisma.book.findMany({
      where:   { authorId },
      select:  BOOK_SELECT,
      orderBy: { updatedAt: 'desc' },
    })
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({ where: { id }, select: BOOK_SELECT })
    if (!book) throw new NotFoundException('Book not found')
    return book
  }

  async create(authorId: string, dto: CreateBookDto) {
    return this.prisma.book.create({
      data:   { ...dto, authorId },
      select: BOOK_SELECT,
    })
  }

  async update(id: string, requesterId: string, requesterRole: UserRole, dto: UpdateBookDto) {
    const book = await this.findOne(id)
    if ((book.author as { id: string }).id !== requesterId && requesterRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You do not own this book')
    }
    return this.prisma.book.update({ where: { id }, data: dto, select: BOOK_SELECT })
  }

  async updateStatus(id: string, requesterId: string, requesterRole: UserRole, dto: UpdateStatusDto) {
    const book = await this.findOne(id)
    const isOwner = (book.author as { id: string }).id === requesterId
    if (!isOwner && requesterRole !== UserRole.ADMIN) throw new ForbiddenException('Forbidden')

    const allowed = ALLOWED_TRANSITIONS[book.status]
    if (!allowed.includes(dto.status)) {
      throw new ForbiddenException(`Cannot transition from ${book.status} to ${dto.status}`)
    }
    return this.prisma.book.update({ where: { id }, data: { status: dto.status }, select: BOOK_SELECT })
  }

  async remove(id: string, requesterId: string, requesterRole: UserRole) {
    const book = await this.findOne(id)
    if ((book.author as { id: string }).id !== requesterId && requesterRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You do not own this book')
    }
    await this.prisma.book.delete({ where: { id } })
    return { message: 'Book deleted' }
  }
}
