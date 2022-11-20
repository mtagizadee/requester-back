import { IsNotEmpty, IsEmail, IsString, Length } from "class-validator";

export class LoginUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(4, 20)
    password: string;
}