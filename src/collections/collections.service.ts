import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import Redis from 'ioredis';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

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
    if (!collections) throw new NotFoundException('Collections are not found.');

    return collections;
  }

  async findOne(id: string, userId: number) {
    const collection = await this.prismaService.collection.findFirst({
      where: {
        id,
        users: {
          some: { userId }
        }
      }
    })
    if (!collection) throw new NotFoundException('Collection is not found.');

    return collection;
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
      return this.prismaService.collection.delete({ where: { id } });
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
}
