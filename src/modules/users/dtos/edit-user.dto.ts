import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDTO } from "./user.DTO";

export class EditUserDto extends PartialType(CreateUserDTO) {}