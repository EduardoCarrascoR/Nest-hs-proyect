import { reportType } from "../common/enums";
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
  reportId: number;

  @Column({ name: "type", type: "enum", enum: reportType, default: reportType.OFFICE1 })
  type: reportType;

  @Column("time", { name: "time", nullable: true })
  time: string | null;

  @Column("int", { name: "shift_news_news_id", nullable: true }) // quizas borrar
  shiftNewsNewsId: number | null;

  @Column("int", { name: "shift_client_client_id", nullable: true })
  clientId: number | null;

  @Column("int", { name: "shift_guard_id", nullable: true })
  guardId: number | null;

  @Column("int", { name: "shift_shift_id", nullable: true })
  shiftId: number | null;

  @ManyToOne(() => Shift, (shift) => shift.reports, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "shift_shift_id", referencedColumnName: "shiftId" }])
  shiftShiftId: Shift;
}
