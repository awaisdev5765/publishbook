import { PrismaClient, UserRole, BookStatus, OrderStatus, ServiceType } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱  Seeding database...')

  // ── Admin user ──────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('Admin123!', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@smartbookpublishing.com' },
    update: {},
    create: {
      name:         'Admin User',
      email:        'admin@smartbookpublishing.com',
      passwordHash: adminHash,
      role:         UserRole.ADMIN,
    },
  })

  // ── Author user ─────────────────────────────────────────────────────────
  const authorHash = await bcrypt.hash('Author123!', 10)
  const author = await prisma.user.upsert({
    where: { email: 'sarah@example.com' },
    update: {},
    create: {
      name:         'Sarah Chen',
      email:        'sarah@example.com',
      passwordHash: authorHash,
      role:         UserRole.AUTHOR,
    },
  })

  // ── Client user ─────────────────────────────────────────────────────────
  const clientHash = await bcrypt.hash('Client123!', 10)
  const client = await prisma.user.upsert({
    where: { email: 'james@example.com' },
    update: {},
    create: {
      name:         'James O\'Brien',
      email:        'james@example.com',
      passwordHash: clientHash,
      role:         UserRole.CLIENT,
    },
  })

  // ── Sample book ─────────────────────────────────────────────────────────
  const book = await prisma.book.upsert({
    where: { id: 'seed-book-1' },
    update: {},
    create: {
      id:       'seed-book-1',
      title:    'The Midnight Garden',
      genre:    'Literary Fiction',
      status:   BookStatus.PUBLISHED,
      synopsis: 'A sweeping story of memory, loss, and the quiet magic found in forgotten places.',
      authorId: author.id,
    },
  })

  // ── Sample order ─────────────────────────────────────────────────────────
  await prisma.order.upsert({
    where: { id: 'seed-order-1' },
    update: {},
    create: {
      id:          'seed-order-1',
      serviceType: ServiceType.FULL_PACKAGE,
      amount:      99700, // $997.00 in cents
      status:      OrderStatus.PAID,
      userId:      client.id,
      bookId:      book.id,
    },
  })

  // ── Sample review ────────────────────────────────────────────────────────
  await prisma.review.upsert({
    where: { userId_bookId: { userId: client.id, bookId: book.id } },
    update: {},
    create: {
      rating:      5,
      content:     'Working with Smart Book Publishing was a game-changer. My debut novel reached the Amazon Top 10 within its first week.',
      isPublished: true,
      userId:      client.id,
      bookId:      book.id,
    },
  })

  // ── Sample blog post ─────────────────────────────────────────────────────
  await prisma.blogPost.upsert({
    where: { slug: 'how-to-write-a-query-letter' },
    update: {},
    create: {
      title:       'How to Write a Query Letter That Gets Noticed',
      slug:        'how-to-write-a-query-letter',
      excerpt:     'A great query letter is your book\'s first impression. Here\'s how to make it count.',
      content:     'Your query letter is the first thing a publisher or agent reads...',
      isPublished: true,
      publishedAt: new Date(),
      tags:        ['writing', 'publishing', 'tips'],
      authorId:    admin.id,
    },
  })

  // ── Sample contact message ────────────────────────────────────────────────
  await prisma.contact.create({
    data: {
      name:    'Maria Santos',
      email:   'maria@example.com',
      subject: 'Question about the Author plan',
      message: 'Hi, I\'d like to know more about what\'s included in the audiobook production for the Author plan.',
    },
  })

  console.log('✅  Seed complete.')
  console.log(`   Admin:  admin@smartbookpublishing.com / Admin123!`)
  console.log(`   Author: sarah@example.com / Author123!`)
  console.log(`   Client: james@example.com / Client123!`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
