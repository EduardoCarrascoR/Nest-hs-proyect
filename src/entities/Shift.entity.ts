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
import { Workedhours } from "./WorkedHours.entity";
import { Visit } from "./Visit.entity";
import { GuardsLocation } from "./GuardsLocation.entity";

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

  @Column("int", { primary: true, name: "client_client_id" })
  client: number;
  
  @Column("varchar", { name: "shift_place", length: 200 })
  shiftPlace: string;

  @OneToMany(() => Report, (report) => report.shiftShiftId)
  reports: Report[];

  @OneToMany(() => Workedhours, (workedhours) => workedhours.shiftHours)
  workedhours: Workedhours[];

  @ManyToOne(() => Client, (client) => client.shifts, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "client_client_id", referencedColumnName: "clientId" }])
  clientClient: Client;

  @OneToMany(() => News, (news) => news.shiftsShifts)
  news: News[];

  @OneToMany(() => Visit, (visit) => visit.shift)
  visits: Visit[];

  @OneToMany(() => GuardsLocation, (guardsLocation) => guardsLocation.shift)
  guardLocation: GuardsLocation[];

  @ManyToMany(() => User, (user) => user.shifts)
  @JoinTable()
  guards: User[];
}
