import { PartialType } from "@nestjs/swagger";
import { ClientDTO } from "./client.dto";

export class EditClientDto extends PartialType(ClientDTO) {}