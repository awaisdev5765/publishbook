import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards,
} from '@nestjs/common'
import { UserRole, BookStatus } from '@prisma/client'
import { BooksService }     from './books.service'
import { CreateBookDto }    from './dto/create-book.dto'
import { UpdateBookDto }    from './dto/update-book.dto'
import { UpdateStatusDto }  from './dto/update-status.dto'
import { Public }           from '../../common/decorators/public.decorator'
import { CurrentUser }      from '../../common/decorators/current-user.decorator'
import { Roles }            from '../../common/decorators/roles.decorator'
import { RolesGuard }       from '../../common/guards/roles.guard'

@Controller('books')
@UseGuards(RolesGuard)
export class BooksController {
  constructor(private readonly books: BooksService) {}

  @Get()
  @Public()
  findAll(
    @Query('genre') genre?: string,
    @Query('status') status?: BookStatus,
  ) {
    return this.books.findAll(genre, status)
  }

  @Get('mine')
  findMine(@CurrentUser('id') id: string) {
    return this.books.findMine(id)
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.books.findOne(id)
  }

  @Post()
  @Roles(UserRole.CLIENT, UserRole.AUTHOR, UserRole.ADMIN)
  create(@CurrentUser('id') authorId: string, @Body() dto: CreateBookDto) {
    return this.books.create(authorId, dto)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser('id') requesterId: string,
    @CurrentUser('role') requesterRole: UserRole,
    @Body() dto: UpdateBookDto,
  ) {
    return this.books.update(id, requesterId, requesterRole, dto)
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser('id') requesterId: string,
    @CurrentUser('role') requesterRole: UserRole,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.books.updateStatus(id, requesterId, requesterRole, dto)
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser('id') requesterId: string,
    @CurrentUser('role') requesterRole: UserRole,
  ) {
    return this.books.remove(id, requesterId, requesterRole)
  }
}
