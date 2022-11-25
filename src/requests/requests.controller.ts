import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

export type TRequestsQuery = {
  folderId: number;
}

@UseGuards(JwtAuthGuard)
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) { }

  @Post()
  create(@Body() createRequestDto: CreateRequestDto, @GetUser('id') userId: number) {
    return this.requestsService.create(createRequestDto, userId);
  }

  @Get(':folderId')
  findAll(@Param('folderId', ParseIntPipe) folderId: number) {
    return this.requestsService.findAll(folderId);
  }

  @Get('single/:id')
  findOne(@Param('id', ParseIntPipe) id: number, @Query() query: TRequestsQuery) {
    if (!query || !query.folderId) throw new BadRequestException('Folder id is required.');
    return this.requestsService.findOne(id, parseInt(query.folderId as unknown as string));
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRequestDto: UpdateRequestDto,
    @GetUser('id') userId: number
  ) {
    return this.requestsService.update(id, updateRequestDto, userId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: TRequestsQuery,
    @GetUser('id') userId: number
  ) {
    if (!query || !query.folderId) throw new BadRequestException('Folder id is required.');
    return this.requestsService.remove(id, parseInt(query.folderId as unknown as string), userId);
  }
}
