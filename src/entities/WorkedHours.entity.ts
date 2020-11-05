import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { Shift } from "./Shift.entity";
  
  @Index("FK_86c28725eca222b28f7f03b81f6", ["shiftHoursId"], {})
  @Entity("workedhours", { schema: "hs" })
  export class Workedhours {
    @PrimaryGeneratedColumn({ type: "int", name: "idWorkedHours" })
    idWorkedHours: number;
  
    @Column("int", { name: "guard_Id" })
    guardId: number;
  
    @Column("time", { name: "start", nullable: true })
    start: string | null;
  
    @Column("time", { name: "finish", nullable: true })
    finish: string | null;
  
    @Column("int", { name: "shift_hours_id", nullable: true })
    shiftHoursId: number | null;
  
    @ManyToOne(() => Shift, (shift) => shift.workedhours, {
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    })
    @JoinColumn([{ name: "shift_hours_id", referencedColumnName: "shiftId" }])
    shiftHours: Shift;
  }
  