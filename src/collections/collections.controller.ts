import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@UseGuards(JwtAuthGuard)
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) { }

  @Post()
  create(@GetUser('id') userId: number, @Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionsService.create(userId, createCollectionDto);
  }

  @Get()
  findAll(@GetUser('id') userId: number) {
    return this.collectionsService.findAll(userId);
  }

  @Get(':id')
  findOne(@GetUser('id') userId: number, @Param('id') id: string) {
    return this.collectionsService.findOne(id, userId);
  }

  @Get('enter/latest')
  findLatest(@GetUser('id') userId: number) {
    return this.collectionsService.findLatestEntry(userId);
  }

  @Patch(':id')
  update(
    @GetUser('id') userId: number,
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto
  ) {
    return this.collectionsService.update(id, userId, updateCollectionDto);
  }

  @Delete(':id')
  remove(@GetUser('id') userId: number, @Param('id') id: string) {
    return this.collectionsService.remove(id, userId);
  }
}
