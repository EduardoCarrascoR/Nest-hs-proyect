import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import * as bcrypt from "bcrypt";
import { Shift } from "./Shift.entity";
import { GuardsLocation } from "./GuardsLocation.entity";

@Entity("user", { schema: "hs" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id" })
  id: number;

  @Column("varchar", { name: "firstname", nullable: true, length: 45 })
  firstname: string | null;
  
  @Column("varchar", { name: "lastname", nullable: true, length: 45 })
  lastname: string | null;

  @Column({ name: "roles", type: 'simple-array'})
  roles: string[];

  @Column("varchar", { name: "rut", unique: true, length: 13 })
  rut: string;

  @Column("varchar", { name: "phone", nullable: true, length: 45 })
  phone: string | null;

  @Column("varchar", { name: "email", nullable: true, length: 45 })
  email: string | null;

  @Column("varchar", { name: "email_verified", nullable: true, length: 45 })
  emailVerified: string | null;

  @Column("varchar", { name: "location", nullable: true, length: 200 })
  location: string | null;

  @Column({ name: "time_location", type: "time", nullable: true })
  timeLocation: string | null;

  @Column("varchar", { name: "password", length: 200, select: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Shift, (shift) => shift.guards)
  shifts: Shift[];

  @ManyToOne(() => GuardsLocation, (guardsLocation) => guardsLocation.user, {})
  guardUserLocation: GuardsLocation;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if(!this.password) {
      return;
    }
    this.password = await bcrypt.hash(this.password, 10);
  }

}
