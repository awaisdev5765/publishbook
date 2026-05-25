import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { PrismaModule }   from './prisma/prisma.module'
import { AuthModule }     from './modules/auth/auth.module'
import { UsersModule }    from './modules/users/users.module'
import { BooksModule }    from './modules/books/books.module'
import { OrdersModule }   from './modules/orders/orders.module'
import { BlogModule }     from './modules/blog/blog.module'
import { ContactModule }  from './modules/contact/contact.module'
import { AboutModule }    from './modules/about/about.module'
import { JwtAuthGuard }   from './common/guards/jwt-auth.guard'
import { RolesGuard }     from './common/guards/roles.guard'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:        true,
      envFilePath:     ['.env.local', '.env'],
      expandVariables: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    BooksModule,
    OrdersModule,
    BlogModule,
    ContactModule,
    AboutModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard   },
  ],
})
export class AppModule {}
