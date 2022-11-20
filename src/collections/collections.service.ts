import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import Redis from 'ioredis';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Collection } from '@prisma/client';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly prismaService: PrismaService
  ) { }

  async create(userId: number, createCollectionDto: CreateCollectionDto) {
    const collection = await this.prismaService.collection.create({
      data: {
        ...createCollectionDto,
        ownerId: userId,
        users: {
          create: { userId }
        }
      }
    });
    if (!collection) throw new BadRequestException('Collection could not be created');

    return collection;
  }

  async findAll(userId: number) {
    const collections = await this.prismaService.collection.findMany({
      where: {
        users: {
          some: { userId }
        }
      }
    });
    if (collections.length == 0) throw new NotFoundException('Collections are not found.');

    return collections;
  }

  async findOne(id: string, userId: number) {
    const collection = await this.prismaService.collection.findFirst({
      where: {
        id,
        users: {
          some: { userId }
        }
      },
      include: { folders: true }
    });
    if (!collection) throw new NotFoundException('Collections is not found.');

    return collection;
  }

  async enter(id: string, userId: number) {
    try {
      await this.validateUser(userId, id);
      const collection = await this.prismaService.collection.update({
        where: { id },
        data: { latestEntry: new Date() },
        include: {
          folders: {
            include: { requests: true }
          }
        }
      });

      await this.saveCollectionToRedis(collection, userId);
      return collection;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw new NotFoundException('Collection is not found');
        }
      }

      throw error;
    }
  }

  async update(id: string, userId: number, updateCollectionDto: UpdateCollectionDto) {
    try {
      await this.validateUser(userId, id);
      return this.prismaService.collection.update({
        where: { id },
        data: updateCollectionDto
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw new NotFoundException('Collection is not found');
        }
      }

      throw error;
    }
  }

  async remove(id: string, userId: number) {
    try {
      await this.validateUser(userId, id);
      return this.prismaService.collection.delete({
        where: { id }
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw new NotFoundException('Collection is not found');
        }
      }

      throw error;
    }
  }

  async validateUser(userId: number, id: string) {
    const collections = await this.findAll(userId);
    const userHasCollection = collections.some(collection => collection.id === id);
    if (!userHasCollection) throw new NotFoundException('User cannot update this collection');
  }

  async getCollectionsFromRedis() {
    const collectionAsString = await this.redis.get('collections');
    return JSON.parse(collectionAsString);
  }

  async saveCollectionToRedis(collection: Collection, userId: number) {
    const collections = await this.getCollectionsFromRedis();
    collections[userId] = collection;
    return await this.redis.set('collections', JSON.stringify(collections));
  }

  async enterLatest(userId: number) {
    const collections = await this.getCollectionsFromRedis();
    const collection = collections[userId];

    if (!collection) throw new NotFoundException('Collection is not found');
    return collection;
  }
}
