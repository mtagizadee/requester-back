import { Module } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { CollectionsModule } from 'src/collections/collections.module';

@Module({
  controllers: [FoldersController],
  providers: [FoldersService],
  imports: [CollectionsModule]
})
export class FoldersModule { }
