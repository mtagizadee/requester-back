import { IsNotEmpty, IsString, IsOptional, IsObject, IsInt } from 'class-validator';
import { Method } from '@prisma/client';

export class UpdateRequestDto {
    @IsNotEmpty()
    @IsInt()
    folderId: number;

    @IsOptional()
    @IsString()
    method?: Method;

    @IsOptional()
    @IsString()
    url?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsObject()
    body?: JSON;

    @IsOptional()
    @IsObject()
    headers?: JSON;
}
