import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) { }

  @Post()
  create(@GetUser('id') userId: number, @Body() createFolderDto: CreateFolderDto) {
    return this.foldersService.create(userId, createFolderDto);
  }

  @Patch(':id')
  update(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFolderDto: UpdateFolderDto
  ) {
    return this.foldersService.update(userId, id, updateFolderDto);
  }

  @Delete(':id')
  remove(@GetUser('id') userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.foldersService.remove(userId, id);
  }
}
