import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [UsersModule, JwtModule.register({})],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule { }