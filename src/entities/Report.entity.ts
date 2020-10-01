import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Shift } from "./Shift.entity";

@Entity("report", { schema: "hs" })
export class Report {
  @PrimaryGeneratedColumn({ type: "int", name: "repoirt_id" })
  repoirtId: number;

  @Column("datetime", { name: "time", nullable: true })
  time: Date | null;

  @Column("int", { name: "shift_news_news_id", nullable: true })
  shiftNewsNewsId: number | null;

  @Column("int", { name: "shift_client_client_id", nullable: true })
  shiftClientClientId: number | null;

  @ManyToOne(() => Shift, (shift) => shift.reports, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "shift_shift_id", referencedColumnName: "shiftId" }])
  shiftShiftId: Shift;
}
