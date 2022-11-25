import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { CollectionsService } from 'src/collections/collections.service';
import { Request } from '@prisma/client';

@Injectable()
export class RequestsService {

  constructor(
    private readonly prismaService: PrismaService,
    @InjectRedis() private readonly redis: Redis,
    private readonly collectionsService: CollectionsService
  ) { }

  async create(createRequestDto: CreateRequestDto, userId: number) {
    try {
      const request = await this.prismaService.request.create({
        data: {
          ...createRequestDto,
          body: createRequestDto.body ? JSON.parse(JSON.stringify(createRequestDto.body)) : undefined,
          headers: createRequestDto.headers ? JSON.parse(JSON.stringify(createRequestDto.headers)) : undefined,
        }
      });
      await this.saveRequestToRedis(request, createRequestDto.folderId, userId);
      return request;
    } catch (error) {
      throw error;
    }
  }

  async findAll(folderId: number) {
    const requests = await this.prismaService.request.findMany({
      where: {
        folderId
      }
    });
    if (!requests || requests.length === 0) throw new NotFoundException('Requests are not found.');
    return requests;
  }

  async findOne(id: number, folderId: number) {
    if (Number.isNaN(folderId)) throw new BadRequestException('Folder id is not valid.');
    const request = await this.prismaService.request.findFirst({
      where: {
        id,
        folderId
      }
    });
    if (!request) throw new NotFoundException('Request is not found.');
    return request;
  }

  async update(id: number, updateRequestDto: UpdateRequestDto, userId) {
    const { folderId, ...rest } = updateRequestDto;

    try {
      await this.findOne(id, folderId);

      const request = await this.prismaService.request.update({
        where: { id },
        data: {
          ...rest,
          body: rest.body ? JSON.parse(JSON.stringify(rest.body)) : undefined,
          headers: rest.headers ? JSON.parse(JSON.stringify(rest.headers)) : undefined,
        }
      });
      await this.updateRequestInRedis(request, folderId, userId);
      return request;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number, folderId: number, userId: number) {
    if (Number.isNaN(folderId)) throw new BadRequestException('Folder id is not valid.');
    try {
      const request = await this.prismaService.request.delete({
        where: { id }
      });
      await this.deleteRequestFromRedis(request.id, folderId, userId);
      return request;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw new NotFoundException('User is not found');
        }
      }
    }
  }

  async saveRequestToRedis(request: Request, folderId: number, userId: number) {
    try {
      const collections = await this.collectionsService.getCollectionsFromRedis();
      const collection = collections[userId];

      var i = 0;
      const folder = collection.folders.find((folder: any, index: number) => {
        if (folder.id === folderId) {
          i = index;
          return true;
        }
      });

      const requests = [...folder.requests, request];
      collection.folders[i].requests = requests;
      await this.collectionsService.saveCollectionToRedis(collection, userId);
    } catch (error) {
      throw error;
    }
  }

  async deleteRequestFromRedis(requestId: number, folderId: number, userId: number) {
    try {
      const collections = await this.collectionsService.getCollectionsFromRedis();
      const collection = collections[userId];

      var i = 0;
      const folder = collection.folders.find((folder: any, index: number) => {
        if (folder.id === folderId) {
          i = index;
          return true;
        }
      });

      const requests = folder.requests.filter((request: any) => request.id !== requestId);
      collection.folders[i].requests = requests;
      await this.collectionsService.saveCollectionToRedis(collection, userId);
    } catch (error) {
      throw error;
    }
  }

  async updateRequestInRedis(request: Request, folderId: number, userId: number) {
    try {
      const collections = await this.collectionsService.getCollectionsFromRedis();
      const collection = collections[userId];

      var i = 0;
      const folder = collection.folders.find((folder: any, index: number) => {
        if (folder.id === folderId) {
          i = index;
          return true;
        }
      });

      const requests = folder.requests.map((req: any) => {
        if (req.id === request.id) {
          return request;
        }
        return req;
      });

      collection.folders[i].requests = requests;
      await this.collectionsService.saveCollectionToRedis(collection, userId);
    } catch (error) {
      throw error;
    }

  }

}
