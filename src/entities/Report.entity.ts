import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Shift } from "./Shift.entity";

@Index("fk_report_shift1_idx", ["shiftShiftId1"], {})
@Entity("report", { schema: "hs" })
export class Report {
  @PrimaryGeneratedColumn({ type: "int", name: "repoirt_id" })
  repoirtId: number;

  @Column("datetime", { name: "time", nullable: true })
  time: Date | null;

  @Column("int", { name: "shift_shift_id", nullable: true })
  shiftShiftId: number | null;

  @Column("int", { name: "shift_news_news_id", nullable: true })
  shiftNewsNewsId: number | null;

  @Column("int", { name: "shift_client_client_id", nullable: true })
  shiftClientClientId: number | null;

  @Column("int", { primary: true, name: "shift_shift_id1" })
  shiftShiftId1: number;

  @ManyToOne(() => Shift, (shift) => shift.reports, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "shift_shift_id1", referencedColumnName: "shiftId" }])
  shiftShiftId2: Shift;
}
