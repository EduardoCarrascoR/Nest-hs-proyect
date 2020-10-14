import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Report } from "./Report.entity";
import { Client } from "./Client.entity";
import { News } from "./News.entity";
import { User } from "./User.entity";
import { shiftType, shiftState } from "../common/enums";

@Index("fk_shift_client1_idx", ["client"], {})
@Entity("shift", { schema: "hs" })
export class Shift {
  @PrimaryGeneratedColumn({ type: "int", name: "shift_id" })
  shiftId: number;

  @Column({ name: "type", type: "enum", enum: shiftType, default: shiftType.DAY })
  type: shiftType;

  @Column({ name: "start", type: "time", nullable: true })
  start: string | null;

  @Column("datetime", { name: "true_start_shift", nullable: true })
  trueStartShift: Date | null;

  @Column({ name: "finish", type: "time", nullable: true })
  finish: string | null;

  @Column("datetime", { name: "true_finish_shift", nullable: true })
  trueFinishShift: Date | null;

  @Column({ name: "date", type: "date", nullable: true })
  date: Date | null;

  @Column({ name: "state", type: "enum", enum: shiftState, default: shiftState.Assigned })
  state: shiftState;

  @Column({ name: "news_news_id", type: "int", nullable: true })
  newsNewsId: number;

  @Column("int", { primary: true, name: "client_client_id" })
  client: number;
  
  @Column("varchar", { name: "shift_place", length: 200 })
  shiftPlace: string;

  @OneToMany(() => Report, (report) => report.shiftShiftId)
  reports: Report[];

  @ManyToOne(() => Client, (client) => client.shifts, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "client_client_id", referencedColumnName: "clientId" }])
  clientClient: Client;

  @ManyToOne(() => News, (news) => news.shifts, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "news_news_id", referencedColumnName: "newsId" }])
  newsNews: News;

  @ManyToMany(() => User, (user) => user.shifts)
  @JoinTable()
  guards: User[];
}
