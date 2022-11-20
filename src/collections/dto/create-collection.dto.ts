import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCollectionDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}
