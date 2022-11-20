import { ForbiddenException, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from "./dto/login-user.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto";


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async login(loginUserDto: LoginUserDto) {
        try {
            const user = await this.usersService.findOneByEmail(loginUserDto.email);
            if (user.password != loginUserDto.password) throw new ForbiddenException('Wrong password.');

            const payload = { email: user.email };
            return { access_token: this.jwtService.sign(payload) };
        } catch (error) {
            throw error;
        }
    }

    async signup(createUserDto: CreateUserDto) {
        try {
            return await this.usersService.create(createUserDto);
        } catch (error) {
            throw error;
        }
    }
}