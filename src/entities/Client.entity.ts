import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Shift } from "./Shift.entity";

@Entity("client", { schema: "hs" })
export class Client {
  @PrimaryGeneratedColumn({ type: "int", name: "client_id" })
  clientId: number;

  @Column("varchar", { name: "name", nullable: true, length: 45 })
  name: string | null;

  @Column("varchar", { name: "phone", nullable: true, length: 45 })
  phone: string | null;

  @Column("varchar", { name: "email", nullable: true, length: 45 })
  email: string | null;

  @Column("varchar", { name: "address", nullable: true, length: 45 })
  address: string | null;

  @OneToMany(() => Shift, (shift) => shift.client)
  shifts: Shift[];
}
