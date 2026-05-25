import {
  Injectable, NotFoundException, ForbiddenException,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import type { CreatePostDto } from './dto/create-post.dto'
import type { UpdatePostDto }  from './dto/update-post.dto'
import type { QueryPostsDto }  from './dto/query-posts.dto'

const POST_SELECT = {
  id: true, title: true, slug: true, excerpt: true,
  coverImageUrl: true, isPublished: true, publishedAt: true,
  tags: true, createdAt: true, updatedAt: true,
  author: { select: { id: true, name: true, avatarUrl: true } },
} as const

const POST_FULL_SELECT = { ...POST_SELECT, content: true } as const

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryPostsDto) {
    const { tag, page = 1, limit = 10 } = query
    const skip = (page - 1) * limit

    const where = {
      isPublished: true,
      ...(tag && { tags: { has: tag } }),
    }

    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where, select: POST_SELECT,
        orderBy: { publishedAt: 'desc' },
        skip, take: limit,
      }),
      this.prisma.blogPost.count({ where }),
    ])

    return { posts, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findAllAdmin() {
    return this.prisma.blogPost.findMany({
      select:  POST_SELECT,
      orderBy: { createdAt: 'desc' },
    })
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug }, select: POST_FULL_SELECT,
    })
    if (!post || !post.isPublished) throw new NotFoundException('Post not found')
    return post
  }

  async findOneAdmin(id: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id }, select: POST_FULL_SELECT,
    })
    if (!post) throw new NotFoundException('Post not found')
    return post
  }

  async create(authorId: string, dto: CreatePostDto) {
    const baseSlug = slugify(dto.title)
    const existing = await this.prisma.blogPost.findUnique({ where: { slug: baseSlug } })
    const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug

    return this.prisma.blogPost.create({
      data: {
        title:         dto.title,
        slug,
        content:       dto.content,
        excerpt:       dto.excerpt,
        coverImageUrl: dto.coverImageUrl,
        tags:          dto.tags ?? [],
        isPublished:   dto.isPublished ?? false,
        publishedAt:   dto.isPublished ? new Date() : null,
        authorId,
      },
      select: POST_FULL_SELECT,
    })
  }

  async update(id: string, requesterId: string, requesterRole: UserRole, dto: UpdatePostDto) {
    const post = await this.findOneAdmin(id)
    if ((post.author as { id: string }).id !== requesterId && requesterRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Forbidden')
    }

    // Re-slug only if title changed and new slug doesn't collide
    let slug = post.slug
    if (dto.title && dto.title !== post.title) {
      const newSlug = slugify(dto.title)
      const conflict = await this.prisma.blogPost.findFirst({
        where: { slug: newSlug, NOT: { id } },
      })
      slug = conflict ? `${newSlug}-${Date.now()}` : newSlug
    }

    return this.prisma.blogPost.update({
      where:  { id },
      data:   { ...dto, slug },
      select: POST_FULL_SELECT,
    })
  }

  async publish(id: string, requesterRole: UserRole) {
    if (requesterRole !== UserRole.ADMIN) throw new ForbiddenException('Forbidden')
    const post = await this.findOneAdmin(id)
    const isPublished = !post.isPublished
    return this.prisma.blogPost.update({
      where: { id },
      data:  { isPublished, publishedAt: isPublished ? new Date() : null },
      select: POST_FULL_SELECT,
    })
  }

  async remove(id: string, requesterId: string, requesterRole: UserRole) {
    const post = await this.findOneAdmin(id)
    if ((post.author as { id: string }).id !== requesterId && requesterRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Forbidden')
    }
    await this.prisma.blogPost.delete({ where: { id } })
    return { message: 'Post deleted' }
  }
}
