import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { CollectionsModule } from 'src/collections/collections.module';

@Module({
  controllers: [RequestsController],
  providers: [RequestsService],
  imports: [CollectionsModule]
})
export class RequestsModule { }
