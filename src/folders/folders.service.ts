import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CollectionsService } from 'src/collections/collections.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import Redis from 'ioredis';
import { Folder } from '@prisma/client';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly collectionService: CollectionsService,
    private readonly prismaService: PrismaService
  ) { }

  async create(userId: number, createFolderDto: CreateFolderDto) {
    try {
      await this.validateFolderName(createFolderDto.collectionId, createFolderDto.name, userId);
      const createdFolder = await this.prismaService.folder.create({ data: createFolderDto })

      await this.saveFolderToRedis(userId, createdFolder);
      return createdFolder;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    const folder = await this.prismaService.folder.findUnique({
      where: { id }
    });
    if (!folder) throw new NotFoundException('Folder is not found');
    return folder;
  }

  async update(userId: number, id: number, updateFolderDto: UpdateFolderDto) {
    try {
      const folder = await this.findOne(id);
      await this.validateFolderName(folder.collectionId, updateFolderDto.name, userId);
      const updatedFolder = await this.prismaService.folder.update({
        where: { id },
        data: { name: updateFolderDto.name }
      });

      await this.updateFolderInRedis(userId, updatedFolder);
      return updatedFolder;
    } catch (error) {
      throw error;
    }
  }

  async remove(userId: number, id: number) {
    try {
      const folder = await this.findOne(id);
      await this.collectionService.validateUser(userId, folder.collectionId);
      const deletedFolder = await this.prismaService.folder.delete({ where: { id } });

      await this.removeFolderFromRedis(userId, deletedFolder.id);
      return deletedFolder;
    } catch (error) {
      throw error;
    }
  }

  async validateFolderName(collectionId: string, collectionName: string, userId: number) {
    const collection = await this.collectionService.findOne(collectionId, userId);
    const folderExists = collection.folders.some(folder => folder.name === collectionName);
    if (folderExists) throw new ConflictException('Folder already exists in this collection');
  }

  async saveFolderToRedis(userId: number, folder: Folder) {
    try {
      const collections = await this.collectionService.getCollectionsFromRedis();
      const collection = collections[userId];

      collection.folders = [...collection.folders, folder];
      collections[userId] = collection;
      return await this.redis.set('collections', JSON.stringify(collections));
    } catch (error) {
      throw error;
    }
  }

  async removeFolderFromRedis(userId: number, folderId: number) {
    try {
      const collections = await this.collectionService.getCollectionsFromRedis();
      const collection = collections[userId];

      collection.folders = collection.folders.filter((folder: any) => folder.id !== folderId);
      collections[userId] = collection;
      return await this.redis.set('collections', JSON.stringify(collections));
    } catch (error) {
      throw error;
    }
  }

  async updateFolderInRedis(userId: number, folder: Folder) {
    try {
      const collections = await this.collectionService.getCollectionsFromRedis();
      const collection = collections[userId];

      const index = collection.folders.findIndex((folder) => folder.id === folder.id)
      collection.folders[index] = folder;

      collections[userId] = collection;
      return await this.redis.set('collections', JSON.stringify(collections));
    } catch (error) {
      throw error;
    }
  }
}