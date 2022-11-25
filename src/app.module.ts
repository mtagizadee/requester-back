import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CollectionsModule } from './collections/collections.module';
import { RedisModule } from "@liaoliaots/nestjs-redis"
import { FoldersModule } from './folders/folders.module';
import { RequestsModule } from './requests/requests.module';
import Redis from 'ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    RedisModule.forRootAsync({
      useFactory: () => ({
        config: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),
          onClientCreated: (redis: Redis) => {
            redis.on('ready', async () => {
              const collections = await redis.get('collections')
              if (!collections) await redis.set('collections', JSON.stringify({}));
            })
          }
        },
      }),
    }),
    UsersModule, PrismaModule,
    AuthModule, CollectionsModule, FoldersModule, RequestsModule
  ],
})
export class AppModule { }
