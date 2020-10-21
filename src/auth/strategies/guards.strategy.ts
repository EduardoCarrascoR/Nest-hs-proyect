import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../services/auth.service";


@Injectable()
export class GuardStrategy extends PassportStrategy(Strategy, 'guards') {
    constructor(
        private readonly authService: AuthService
    ) {
        super({
            usernameField: 'rut',     //username
            passwordField: 'password'   //passport
        })
    }
    async validate( rut: string, password: string) {
        const user = await this.authService.validateUserGuard(rut, password)

        if(!user) throw new UnauthorizedException('Login user or password does not match');
        return user;
    }
}