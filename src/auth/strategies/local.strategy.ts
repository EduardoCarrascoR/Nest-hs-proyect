import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../services/auth.service";

@Injectable()
export class localStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService
    ) {
        super({
            usernameField: 'email',     //username
            passwordField: 'password'   //passport
        })
    }
    async validate( email: string, password: string) {
        const user = await this.authService.validateUser(email, password)

        if(!user) throw new UnauthorizedException('Login user or password does not match');
        return user;
    }
}