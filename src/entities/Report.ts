import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
