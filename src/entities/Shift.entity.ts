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

@Index("fk_shift_news1_idx", ["newsNewsId"], {})
@Index("fk_shift_client1_idx", ["clientClientId"], {})
@Entity("shift", { schema: "hs" })
export class Shift {
  @PrimaryGeneratedColumn({ type: "int", name: "shift_id" })
  shiftId: number;

  @Column("varchar", { name: "type", nullable: true, length: 45 })
  type: string | null;

  @Column("datetime", { name: "start", nullable: true })
  start: Date | null;

  @Column("datetime", { name: "true_start_shift", nullable: true })
  trueStartShift: Date | null;

  @Column("datetime", { name: "finish", nullable: true })
  finish: Date | null;

  @Column("datetime", { name: "true_finish_shift", nullable: true })
  trueFinishShift: Date | null;

  @Column("date", { name: "date", nullable: true })
  date: string | null;

  @Column("varchar", { name: "state", nullable: true, length: 45 })
  state: string | null;

  @Column("int", { primary: true, name: "news_news_id" })
  newsNewsId: number;

  @Column("int", { primary: true, name: "client_client_id" })
  clientClientId: number;

  @Column("varchar", { name: "shift_place", length: 200 })
  shiftPlace: string;

  @OneToMany(() => Report, (report) => report.shiftShiftId2)
  reports: Report[];

  @ManyToOne(() => Client, (client) => client.shifts, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  clientClient: Client;

  @ManyToOne(() => News, (news) => news.shifts, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "news_news_id", referencedColumnName: "newsId" }])
  newsNews: News;

  @ManyToMany(() => User, (user) => user.shifts)
  @JoinTable()
  users: User[];
}
