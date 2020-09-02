import { Column, Entity, Index, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, CreateDateColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from "bcrypt";

@Index("rut_UNIQUE", ["rut"], { unique: true })
@Entity("user", { schema: "hs" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id" })
  userId: number;

  @Column("varchar", { name: "firstname", nullable: true, length: 45 })
  firstname: string | null;

  @Column("varchar", { name: "lastname", nullable: true, length: 45 })
  lastname: string | null;

  @Column("varchar", { name: "role", length: 45 })
  role: string;

  @Column("varchar", { name: "rut", unique: true, length: 11 })
  rut: string;
  
  @Column("varchar", { name: "phone", nullable: true, length: 45 })
  phone: string | null;

  @Column("varchar", { name: "email", nullable: true, length: 45 })
  email: string | null;

  @Column("varchar", { name: "email_verified", nullable: true, length: 45 })
  emailVerified: string | null;

  @Column("varchar", { name: "password", length: 200, select: false }) // Putear a wochi XDDD
  password: string;

  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
    updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if(!this.password) {
      return;
    }
    this.password = await bcrypt.hash(this.password, 10);
  }

}
