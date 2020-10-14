import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UsersService } from "../../modules/users/services/users.service";
import { JWT_SECRET } from "../../config/constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userService: UsersService,
        private config: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>(JWT_SECRET),
        });
    }

    async validate(payload: any) {
        const { sub: id } = payload;

        return await this.userService.findOneUser(id)
    }
}