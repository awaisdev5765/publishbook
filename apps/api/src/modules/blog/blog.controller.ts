import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { BlogService }    from './blog.service'
import { CreatePostDto }  from './dto/create-post.dto'
import { UpdatePostDto }  from './dto/update-post.dto'
import { QueryPostsDto }  from './dto/query-posts.dto'
import { Public }         from '../../common/decorators/public.decorator'
import { CurrentUser }    from '../../common/decorators/current-user.decorator'
import { Roles }          from '../../common/decorators/roles.decorator'
import { RolesGuard }     from '../../common/guards/roles.guard'

@Controller('blog')
@UseGuards(RolesGuard)
export class BlogController {
  constructor(private readonly blog: BlogService) {}

  @Get()
  @Public()
  findAll(@Query() query: QueryPostsDto) {
    return this.blog.findAll(query)
  }

  @Get('admin')
  @Roles(UserRole.ADMIN, UserRole.AUTHOR)
  findAllAdmin() {
    return this.blog.findAllAdmin()
  }

  @Get('slug/:slug')
  @Public()
  findBySlug(@Param('slug') slug: string) {
    return this.blog.findBySlug(slug)
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.AUTHOR)
  findOne(@Param('id') id: string) {
    return this.blog.findOneAdmin(id)
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.AUTHOR)
  create(@CurrentUser('id') authorId: string, @Body() dto: CreatePostDto) {
    return this.blog.create(authorId, dto)
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.AUTHOR)
  update(
    @Param('id') id: string,
    @CurrentUser('id') requesterId: string,
    @CurrentUser('role') requesterRole: UserRole,
    @Body() dto: UpdatePostDto,
  ) {
    return this.blog.update(id, requesterId, requesterRole, dto)
  }

  @Patch(':id/publish')
  @Roles(UserRole.ADMIN)
  publish(
    @Param('id') id: string,
    @CurrentUser('role') requesterRole: UserRole,
  ) {
    return this.blog.publish(id, requesterRole)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.AUTHOR)
  remove(
    @Param('id') id: string,
    @CurrentUser('id') requesterId: string,
    @CurrentUser('role') requesterRole: UserRole,
  ) {
    return this.blog.remove(id, requesterId, requesterRole)
  }
}
