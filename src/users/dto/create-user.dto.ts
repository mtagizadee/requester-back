import { IsString, IsNotEmpty, Length, IsEmail } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(4, 20)
    password: string;

    @IsNotEmpty()
    @IsString()
    username: string;
}
