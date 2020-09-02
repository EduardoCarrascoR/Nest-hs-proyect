import { applyDecorators, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/guards";
import { ApiBearerAuth } from "@nestjs/swagger";


export function Auth() {
    return applyDecorators(
        UseGuards(JwtAuthGuard),
        ApiBearerAuth()
    )
}