import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDTO } from "./user.dto";

export class EditUserDto extends PartialType(CreateUserDTO) {}