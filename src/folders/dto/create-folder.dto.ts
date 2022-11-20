import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateFolderDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsUUID()
    collectionId: string;
}
