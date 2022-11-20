import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @Post('signup')
    signup(@Body() createUserDto: CreateUserDto) {
        return this.authService.signup(createUserDto);
    }
}