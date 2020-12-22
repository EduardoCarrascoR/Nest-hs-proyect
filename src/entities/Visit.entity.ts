import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Shift } from "./Shift.entity";

@Index("fk_visit_shift1_idx", ["shiftShiftId", "shiftClientClientId"], {})
@Entity("visit", { schema: "hs" })
export class Visit {
  @PrimaryGeneratedColumn({ type: "int", name: "visit_id" })
  visitId: number;

  @Column("varchar", { name: "name", nullable: true, length: 200 })
  name: string | null;

  @Column("varchar", { name: "patent", unique: true, length: 6 })
  patent: string;

  @Column("varchar", { name: "rut", length: 13 })
  rut: string;
  
  @Column({ name: "in", type: "time", nullable: true })
  in: string | null;

  @Column({ name: "out", type: "time", nullable: true })
  out: string | null;

  @Column("int", { name: "shift_shift_id", nullable: true })
  shiftShiftId: number | null;

  @Column("int", { name: "shift_client_client_id", nullable: true })
  shiftClientClientId: number | null;

  @ManyToOne(() => Shift, (shift) => shift.visits, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([
    { name: "shift_shift_id", referencedColumnName: "shiftId" },
    { name: "shift_client_client_id", referencedColumnName: "client" },
  ])
  shift: Shift;
}
