import { applyDecorators, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/guards";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ACGuard, Role, UseRoles } from "nest-access-control";


export function Auth(...roles: Role[]) {
    return applyDecorators(
        UseGuards(JwtAuthGuard, ACGuard),
        UseRoles(...roles),
        ApiBearerAuth()
    )
}