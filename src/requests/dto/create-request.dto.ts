import { Method } from "@prisma/client";
import { IsString, IsObject, IsNotEmpty, IsOptional, IsInt } from "class-validator";


export class CreateRequestDto {
    @IsNotEmpty()
    @IsString()
    method: Method;

    @IsNotEmpty()
    @IsString()
    url: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsObject()
    body?: JSON;

    @IsOptional()
    @IsObject()
    headers?: JSON;

    @IsNotEmpty()
    @IsInt()
    folderId: number;
}
