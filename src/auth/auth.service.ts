import { ForbiddenException, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from "./dto/login-user.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { verify } from 'argon2';
import { TJwtPayload } from "./strategies/jwt.strategy";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async login(loginUserDto: LoginUserDto) {
        try {
            const user = await this.usersService.findOneByEmail(loginUserDto.email);
            const isPasswordValid = await verify(user.password, loginUserDto.password);
            if (!isPasswordValid) throw new ForbiddenException('Wrong password.');

            const payload: TJwtPayload = { email: user.email };
            return {
                access_token: this.jwtService.sign(payload, {
                    secret: process.env.JWT_SECRET,
                    expiresIn: '30d'
                })
            };
        } catch (error) {
            throw error;
        }
    }

    async signup(createUserDto: CreateUserDto) {
        try {
            await this.usersService.create(createUserDto);
            return { message: 'User signued up successfully.' };
        } catch (error) {
            throw error;
        }
    }
}