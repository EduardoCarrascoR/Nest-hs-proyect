import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("shift", { schema: "hs" })
export class Shift {
  @PrimaryGeneratedColumn({ type: "int", name: "shift_id" })
  shiftId: number;

  @Column("varchar", { name: "type", nullable: true, length: 45 })
  type: string | null;

  @Column("timestamp", { name: "start", nullable: true })
  start: Date | null;

  @Column("datetime", { name: "true_start_shift", nullable: true })
  trueStartShift: Date | null;

  @Column("timestamp", { name: "finish", nullable: true })
  finish: Date | null;

  @Column("datetime", { name: "true_finish_shift", nullable: true })
  trueFinishShift: Date | null;

  @Column("date", { name: "date", nullable: true })
  date: string | null;

  @Column("varchar", { name: "state", nullable: true, length: 45 })
  state: string | null;

  @Column("int", { name: "News_news_id", nullable: true })
  newsNewsId: number | null;

  @Column("int", { name: "Client_client_id", nullable: true })
  clientClientId: number | null;
}
